import { WebsiteInfo } from "../../types/website-info";
import { SeoRule } from "../seoRule";
import { RuleResult } from "../rules";

export class ContentMetricsRule implements SeoRule<WebsiteInfo> {
    analyze(data: WebsiteInfo): RuleResult {
        const metrics = data.contentMetrics;

        // No text content at all
        if (metrics.wordCount === 0) {
            return {
                id: "no-text-content",
                category: "Content",
                title: "No text content",
                passed: false,
                severity: "error",
                score: -10,
                message:
                    "The page contains no visible text content. Search engines cannot rank a page without indexable text.",
                recommendation:
                    "Add meaningful text content to the page. If content is loaded via JavaScript, ensure it renders in the HTML.",
            };
        }

        // Thin content — less than 300 words
        if (metrics.wordCount < 300) {
            return {
                id: "thin-content",
                category: "Content",
                title: "Thin content",
                passed: false,
                severity: "warning",
                score: -5,
                message: `The page has only ${metrics.wordCount} words. Pages with less than 300 words are considered thin content by Google's Helpful Content guidelines.`,
                recommendation:
                    "Expand the page content to at least 300+ words. Focus on depth, value, and relevance to the topic.",
            };
        }

        // Low content (300–600 words) — not penalized but could be better
        if (metrics.wordCount < 600) {
            return {
                id: "moderate-content",
                category: "Content",
                title: "Moderate content length",
                passed: true,
                severity: "info",
                score: 0,
                message: `The page has ${metrics.wordCount} words across ${metrics.paragraphCount} paragraphs. Content is above the thin-content threshold but could benefit from more depth.`,
                recommendation:
                    "Consider expanding content with additional detail, examples, or FAQs to improve topical authority.",
            };
        }

        return {
            id: "content-metrics-ok",
            category: "Content",
            title: "Content depth",
            passed: true,
            severity: "info",
            score: 0,
            message: `Strong content: ${metrics.wordCount} words across ${metrics.paragraphCount} paragraphs.`,
        };
    }
}
