import { WebsiteInfo } from "../../types/website-info";
import { SeoRule } from "../seoRule";
import { RuleResult } from "../rules";

export class HeadingsRule implements SeoRule<WebsiteInfo> {
    analyze(data: WebsiteInfo): RuleResult {
        const h1Count = data.headings.h1.count;
        const h2Count = data.headings.h2.count;

        // No H1 at all — critical for SEO
        if (h1Count === 0) {
            return {
                id: "missing-h1",
                category: "Content",
                title: "Missing H1 heading",
                passed: false,
                severity: "error",
                score: -10,
                message:
                    "The page does not contain an <h1> element. The H1 is the most important on-page SEO signal for topic relevance.",
                recommendation:
                    "Add a single, descriptive <h1> tag that includes the primary keyword for this page.",
            };
        }

        // Multiple H1 tags — confuses search engines about the main topic
        if (h1Count > 1) {
            return {
                id: "multiple-h1",
                category: "Content",
                title: "Multiple H1 headings",
                passed: false,
                severity: "warning",
                score: -5,
                message: `The page contains ${h1Count} <h1> elements. Having multiple H1s dilutes topic focus.`,
                recommendation:
                    "Use a single <h1> per page. Demote extra H1s to <h2> or lower.",
            };
        }

        // Check if H1 text is too short or empty
        const h1Text = data.headings.h1.tags[0] || "";
        if (h1Text.length < 5) {
            return {
                id: "h1-too-short",
                category: "Content",
                title: "H1 heading is too short",
                passed: false,
                severity: "warning",
                score: -3,
                message: `The H1 tag contains only ${h1Text.length} characters ("${h1Text}"). It may not be descriptive enough.`,
                recommendation:
                    "Write a meaningful H1 that describes the page topic in at least a few words.",
            };
        }

        // Check for subheadings (H2) — important for content structure
        if (h2Count === 0) {
            return {
                id: "missing-h2",
                category: "Content",
                title: "No H2 subheadings",
                passed: false,
                severity: "warning",
                score: -3,
                message:
                    "The page has no <h2> elements. Subheadings improve readability and help search engines understand content structure.",
                recommendation:
                    "Break content into logical sections using <h2> subheadings.",
            };
        }

        // Check heading hierarchy — H3 without H2 is a hierarchy skip
        const h3Count = data.headings.h3.count;
        if (h3Count > 0 && h2Count === 0) {
            return {
                id: "heading-hierarchy-skip",
                category: "Content",
                title: "Heading hierarchy skip",
                passed: false,
                severity: "warning",
                score: -3,
                message:
                    "The page uses <h3> tags without any <h2> tags, breaking the heading hierarchy.",
                recommendation:
                    "Maintain a logical heading hierarchy: H1 → H2 → H3 and so on.",
            };
        }

        return {
            id: "headings-ok",
            category: "Content",
            title: "Heading structure",
            passed: true,
            severity: "info",
            score: 0,
            message: `Heading structure is well-formed: 1 H1, ${h2Count} H2s, ${h3Count} H3s.`,
        };
    }
}
