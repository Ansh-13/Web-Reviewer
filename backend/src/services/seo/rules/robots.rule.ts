import { WebsiteInfo } from "../../types/website-info";
import { SeoRule } from "../seoRule";
import { RuleResult } from "../rules";
import { isNULL } from "../utilities";

export class RobotsRule implements SeoRule<WebsiteInfo> {
    analyze(data: WebsiteInfo): RuleResult {
        const robots = data.metadata.robots;
        const content = robots || "";

        // No robots meta tag — not a critical error, but a missed opportunity
        if (isNULL(robots)) {
            return {
                id: "missing-robots",
                category: "Metadata",
                title: "Missing robots meta tag",
                passed: true,
                severity: "info",
                score: 0,
                message:
                    "No <meta name=\"robots\"> tag found. By default, search engines will index and follow links on this page.",
                recommendation:
                    "Consider adding a robots meta tag for explicit crawl directives, especially on pages you want to exclude from indexing.",
                content,
            };
        }

        const directives = robots!
            .toLowerCase()
            .split(",")
            .map((d) => d.trim());

        // Check for noindex — page will be excluded from search results
        const hasNoindex = directives.includes("noindex");
        const hasNofollow = directives.includes("nofollow");
        const hasNone = directives.includes("none");

        // "none" is equivalent to "noindex, nofollow"
        if (hasNone) {
            return {
                id: "robots-none",
                category: "Metadata",
                title: "Robots: none directive",
                passed: false,
                severity: "error",
                score: -10,
                message:
                    "The robots meta tag contains \"none\", which prevents indexing AND link following. This page will not appear in search results.",
                recommendation:
                    "Remove the \"none\" directive unless you intentionally want this page completely hidden from search engines.",
                content,
            };
        }

        if (hasNoindex && hasNofollow) {
            return {
                id: "robots-noindex-nofollow",
                category: "Metadata",
                title: "Robots: noindex and nofollow",
                passed: false,
                severity: "error",
                score: -10,
                message:
                    "The page is set to noindex AND nofollow. It will not be indexed and its outgoing links will not be crawled.",
                recommendation:
                    "Remove noindex/nofollow unless this page should be completely excluded from search engines.",
                content,
            };
        }

        if (hasNoindex) {
            return {
                id: "robots-noindex",
                category: "Metadata",
                title: "Robots: noindex directive",
                passed: false,
                severity: "warning",
                score: -8,
                message:
                    "The page has a \"noindex\" directive. It will not appear in search engine results.",
                recommendation:
                    "Verify this is intentional. Remove \"noindex\" if you want this page to rank in search results.",
                content,
            };
        }

        if (hasNofollow) {
            return {
                id: "robots-nofollow",
                category: "Metadata",
                title: "Robots: nofollow directive",
                passed: false,
                severity: "warning",
                score: -5,
                message:
                    "The page has a \"nofollow\" directive. Search engines will not follow or pass link equity through any links on this page.",
                recommendation:
                    "Remove \"nofollow\" unless you have a specific reason to prevent link equity flow from this page.",
                content,
            };
        }

        return {
            id: "robots-ok",
            category: "Metadata",
            title: "Robots directives",
            passed: true,
            severity: "info",
            score: 0,
            message: `Robots meta tag is set to "${robots}". The page is indexable and crawlable.`,
            content,
        };
    }
}
