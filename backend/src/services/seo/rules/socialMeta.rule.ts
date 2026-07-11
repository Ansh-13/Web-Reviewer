import { WebsiteInfo } from "../../types/website-info";
import { SeoRule } from "../seoRule";
import { RuleResult } from "../rules";

export class SocialMetaRule implements SeoRule<WebsiteInfo> {
    analyze(data: WebsiteInfo): RuleResult {
        const og = data.social.openGraph;
        const tw = data.social.twitter;

        // Count how many OG fields are populated
        const ogFields = [og.title, og.description, og.image, og.url];
        const ogPopulated = ogFields.filter((f) => f !== null).length;

        // Count how many Twitter fields are populated
        const twFields = [tw.card, tw.title, tw.description, tw.image];
        const twPopulated = twFields.filter((f) => f !== null).length;

        const totalPopulated = ogPopulated + twPopulated;
        const totalFields = ogFields.length + twFields.length; // 8

        // No social meta at all
        if (totalPopulated === 0) {
            return {
                id: "no-social-meta",
                category: "Social",
                title: "No social sharing meta tags",
                passed: false,
                severity: "warning",
                score: -5,
                message:
                    "The page has no Open Graph or Twitter Card meta tags. Links shared on social media will display generic previews with no image, title, or description control.",
                recommendation:
                    "Add at minimum: og:title, og:description, og:image, and og:url for rich social sharing previews.",
            };
        }

        // Has OG but no Twitter — OG acts as fallback, but Twitter-specific is better
        if (ogPopulated >= 3 && twPopulated === 0) {
            return {
                id: "missing-twitter-cards",
                category: "Social",
                title: "Missing Twitter Card meta tags",
                passed: true,
                severity: "info",
                score: 0,
                message: `Open Graph is configured (${ogPopulated}/4 fields) but no Twitter Card meta tags found. Twitter will fall back to OG tags, but dedicated Twitter cards offer better control.`,
                recommendation:
                    "Add twitter:card, twitter:title, twitter:description, and twitter:image for optimized Twitter/X previews.",
            };
        }

        // Missing OG image — the most impactful social field
        if (og.image === null) {
            return {
                id: "missing-og-image",
                category: "Social",
                title: "Missing Open Graph image",
                passed: false,
                severity: "warning",
                score: -3,
                message:
                    "No og:image meta tag found. Social shares without an image get significantly lower engagement and click-through rates.",
                recommendation:
                    "Add an og:image tag with a 1200×630px image for optimal display across social platforms.",
            };
        }

        // Partial social meta (< 50% coverage)
        if (totalPopulated < totalFields / 2) {
            return {
                id: "partial-social-meta",
                category: "Social",
                title: "Incomplete social meta tags",
                passed: false,
                severity: "warning",
                score: -3,
                message: `Only ${totalPopulated} of ${totalFields} social meta fields are populated. Incomplete tags result in inconsistent social sharing previews.`,
                recommendation:
                    "Complete all Open Graph (og:title, og:description, og:image, og:url) and Twitter Card (twitter:card, twitter:title, twitter:description, twitter:image) tags.",
            };
        }

        return {
            id: "social-meta-ok",
            category: "Social",
            title: "Social sharing meta",
            passed: true,
            severity: "info",
            score: 0,
            message: `Social meta is well-configured: ${ogPopulated}/4 OG fields and ${twPopulated}/4 Twitter Card fields populated.`,
        };
    }
}
