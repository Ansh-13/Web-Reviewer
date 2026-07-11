import { WebsiteInfo } from "../../types/website-info";
import { SeoRule } from "../seoRule";
import { RuleResult } from "../rules";

export class ImagesRule implements SeoRule<WebsiteInfo> {
    analyze(data: WebsiteInfo): RuleResult {
        const images = data.media.images;
        const content = JSON.stringify(images);

        // No images at all — not necessarily bad, but worth noting
        if (images.count === 0) {
            return {
                id: "no-images",
                category: "Media",
                title: "No images found",
                passed: true,
                severity: "info",
                score: 0,
                message:
                    "The page contains no <img> elements. Images can improve user engagement and appear in image search results.",
                content,
            };
        }

        // Check how many images are missing alt text
        const missingAlt = images.items.filter(
            (img) => !img.alt || img.alt.trim() === ""
        );
        const missingAltCount = missingAlt.length;
        const missingAltPercent = Math.round(
            (missingAltCount / images.count) * 100
        );

        // Check how many images lack explicit dimensions
        const missingDimensions = images.items.filter(
            (img) => !img.width || !img.height
        );
        const missingDimCount = missingDimensions.length;

        // Check for lazy-loading usage
        const lazyLoaded = images.items.filter(
            (img) => img.loading === "lazy"
        );

        // Critical: All images missing alt text
        if (missingAltCount === images.count) {
            return {
                id: "all-images-missing-alt",
                category: "Media",
                title: "All images missing alt text",
                passed: false,
                severity: "error",
                score: -10,
                message: `All ${images.count} images are missing alt attributes. This hurts accessibility and image search indexing.`,
                recommendation:
                    "Add descriptive alt text to every meaningful image. Use alt=\"\" only for purely decorative images.",
                content,
            };
        }

        // Many images missing alt text (> 50%)
        if (missingAltPercent > 50) {
            return {
                id: "many-images-missing-alt",
                category: "Media",
                title: "Most images missing alt text",
                passed: false,
                severity: "warning",
                score: -7,
                message: `${missingAltCount} of ${images.count} images (${missingAltPercent}%) lack alt text.`,
                recommendation:
                    "Add descriptive alt text to images. Good alt text describes the image content concisely.",
                content,
            };
        }

        // Some images missing alt text (> 0%)
        if (missingAltCount > 0) {
            return {
                id: "some-images-missing-alt",
                category: "Media",
                title: "Some images missing alt text",
                passed: false,
                severity: "warning",
                score: -3,
                message: `${missingAltCount} of ${images.count} images lack alt text.`,
                recommendation:
                    "Add descriptive alt text to the remaining images for better accessibility and SEO.",
                content,
            };
        }

        // All alt text present — check dimensions
        if (missingDimCount > images.count / 2) {
            return {
                id: "images-missing-dimensions",
                category: "Media",
                title: "Images missing explicit dimensions",
                passed: true,
                severity: "info",
                score: 0,
                message: `All images have alt text ✓ but ${missingDimCount} of ${images.count} lack explicit width/height, which can cause layout shifts (CLS).`,
                recommendation:
                    "Add width and height attributes to images to reduce Cumulative Layout Shift.",
                content,
            };
        }

        return {
            id: "images-ok",
            category: "Media",
            title: "Image optimization",
            passed: true,
            severity: "info",
            score: 0,
            message: `All ${images.count} images have alt text. ${lazyLoaded.length} use lazy loading. ${images.count - missingDimCount} have explicit dimensions.`,
            content,
        };
    }
}
