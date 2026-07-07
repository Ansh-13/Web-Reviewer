import { WebsiteInfo } from "../../types/website-info";
import { SeoRule } from "../seoRule";
import { RuleResult } from "../rules";

export class SemanticHtmlRule implements SeoRule<WebsiteInfo> {
    analyze(data: WebsiteInfo): RuleResult {
        const s = data.semanticHtml;

        // Count how many semantic landmarks are used
        const landmarks = [
            s.hasNav,
            s.hasMain,
            s.hasHeader,
            s.hasFooter,
            s.hasArticle,
            s.hasSection,
        ];
        const usedCount = landmarks.filter(Boolean).length;

        // No semantic elements at all — page is just divs
        if (usedCount === 0) {
            return {
                id: "no-semantic-html",
                category: "Accessibility",
                title: "No semantic HTML elements",
                passed: false,
                severity: "warning",
                score: -5,
                message:
                    "The page uses no semantic HTML5 landmarks (<nav>, <main>, <header>, <footer>, <article>, <section>). Search engines use semantic structure for passage ranking and content understanding.",
                recommendation:
                    "Replace generic <div> wrappers with appropriate semantic elements like <main>, <nav>, <header>, and <footer>.",
            };
        }

        // Missing <main> — the most important landmark
        if (!s.hasMain) {
            return {
                id: "missing-main-landmark",
                category: "Accessibility",
                title: "Missing <main> landmark",
                passed: false,
                severity: "warning",
                score: -3,
                message: `The page uses ${usedCount} semantic elements but is missing <main>. The <main> landmark identifies the primary content area for search engines and screen readers.`,
                recommendation:
                    "Wrap the primary page content in a <main> element.",
            };
        }

        // Missing <nav> — important for site structure
        if (!s.hasNav) {
            return {
                id: "missing-nav-landmark",
                category: "Accessibility",
                title: "Missing <nav> landmark",
                passed: true,
                severity: "info",
                score: 5,
                message:
                    "No <nav> element found. Using <nav> helps search engines identify navigation sections and improves accessibility.",
                recommendation:
                    "Wrap navigation menus in <nav> elements with descriptive aria-labels.",
            };
        }

        return {
            id: "semantic-html-ok",
            category: "Accessibility",
            title: "Semantic HTML structure",
            passed: true,
            severity: "info",
            score: 10,
            message: `Good semantic structure: using ${usedCount} HTML5 landmark elements (${[
                s.hasNav && "nav",
                s.hasMain && "main",
                s.hasHeader && "header",
                s.hasFooter && "footer",
                s.hasArticle && "article",
                s.hasSection && "section",
            ]
                .filter(Boolean)
                .join(", ")}).`,
        };
    }
}
