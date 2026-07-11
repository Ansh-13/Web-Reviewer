import { WebsiteInfo } from "../../types/website-info";
import { SeoRule } from "../seoRule";
import { RuleResult } from "../rules";

export class HreflangRule implements SeoRule<WebsiteInfo> {
    analyze(data: WebsiteInfo): RuleResult {
        const hreflang = data.hreflang;
        const content = JSON.stringify(hreflang);

        // No hreflang tags — not an error for single-language sites
        if (hreflang.count === 0) {
            return {
                id: "no-hreflang",
                category: "International SEO",
                title: "No hreflang tags",
                passed: true,
                severity: "info",
                score: 0,
                message:
                    "No hreflang alternate links found. This is fine for single-language, single-region sites.",
                recommendation:
                    "If your site targets multiple languages or regions, add hreflang tags to prevent duplicate content issues across locales.",
                content,
            };
        }

        // Check for self-referencing hreflang (best practice)
        const hasSelfRef = hreflang.items.some(
            (item) =>
                item.href !== null &&
                item.href.replace(/\/+$/, "") === data.url.replace(/\/+$/, "")
        );

        if (!hasSelfRef) {
            return {
                id: "hreflang-no-self-ref",
                category: "International SEO",
                title: "Missing self-referencing hreflang",
                passed: false,
                severity: "warning",
                score: -5,
                message: `Found ${hreflang.count} hreflang tags but none reference the current page URL. Every page should include a self-referencing hreflang.`,
                recommendation:
                    "Add a hreflang tag that points to the current page's own URL with the correct language code.",
                content,
            };
        }

        // Check for x-default (fallback for unmatched languages)
        const hasXDefault = hreflang.items.some(
            (item) => item.hreflang === "x-default"
        );

        if (!hasXDefault) {
            return {
                id: "hreflang-no-x-default",
                category: "International SEO",
                title: "Missing x-default hreflang",
                passed: true,
                severity: "info",
                score: 5,
                message: `Found ${hreflang.count} hreflang tags but no x-default fallback. The x-default tag tells search engines which page to show for unmatched languages.`,
                recommendation:
                    "Add an x-default hreflang tag pointing to your language selector or primary language page.",
                content,
            };
        }

        return {
            id: "hreflang-ok",
            category: "International SEO",
            title: "Hreflang configuration",
            passed: true,
            severity: "info",
            score: 0,
            message: `Properly configured: ${hreflang.count} hreflang tags with self-reference and x-default.`,
            content,
        };
    }
}
