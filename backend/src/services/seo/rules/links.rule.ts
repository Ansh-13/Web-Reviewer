import { WebsiteInfo } from "../../types/website-info";
import { SeoRule } from "../seoRule";
import { RuleResult } from "../rules";

export class LinksRule implements SeoRule<WebsiteInfo> {
    analyze(data: WebsiteInfo): RuleResult {
        const links = data.navigation.links;
        const totalLinks = links.count;
        const internalCount = links.internal.length;
        const externalCount = links.external.length;
        const content = JSON.stringify(links);

        // No links at all — very unusual and bad for SEO
        if (totalLinks === 0) {
            return {
                id: "no-links",
                category: "Navigation",
                title: "No links found",
                passed: false,
                severity: "error",
                score: -8,
                message:
                    "The page contains no hyperlinks. Internal linking is critical for crawlability and link equity distribution.",
                recommendation:
                    "Add internal links to related pages and consider adding relevant external links to authoritative sources.",
                content,
            };
        }

        // No internal links — orphan page risk
        if (internalCount === 0) {
            return {
                id: "no-internal-links",
                category: "Navigation",
                title: "No internal links",
                passed: false,
                severity: "warning",
                score: -5,
                message: `The page has ${externalCount} external links but no internal links. This limits crawlability and SEO value flow.`,
                recommendation:
                    "Add internal links to other relevant pages on your site to improve navigation and distribute page authority.",
                content,
            };
        }

        // Very few internal links (< 3) — weak internal linking
        if (internalCount < 3) {
            return {
                id: "few-internal-links",
                category: "Navigation",
                title: "Very few internal links",
                passed: false,
                severity: "warning",
                score: -3,
                message: `Only ${internalCount} internal link(s) found. A strong internal linking strategy helps search engines discover and rank your pages.`,
                recommendation:
                    "Add more contextual internal links to improve site structure and crawlability.",
                content,
            };
        }

        // // Excessive total links (> 200) — link equity dilution
        // if (totalLinks > 200) {
        //     return {
        //         id: "too-many-links",
        //         category: "Navigation",
        //         title: "Excessive number of links",
        //         passed: false,
        //         severity: "warning",
        //         score: 0,
        //         message: `The page contains ${totalLinks} links (${internalCount} internal, ${externalCount} external). An extremely high link count dilutes the value of each link.`,
        //         recommendation:
        //             "Consider reducing the number of links on the page. Keep navigation focused and relevant.",
        //     };
        // }

        return {
            id: "links-ok",
            category: "Navigation",
            title: "Link structure",
            passed: true,
            severity: "info",
            score: 0,
            message: `Good link profile: ${internalCount} internal links and ${externalCount} external links.`,
            content,
        };
    }
}
