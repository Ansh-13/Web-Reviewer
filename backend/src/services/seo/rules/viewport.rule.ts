import { WebsiteInfo } from "../../types/website-info";
import { SeoRule } from "../seoRule";
import { RuleResult } from "../rules";
import { isNULL } from "../utilities";

export class ViewportRule implements SeoRule<WebsiteInfo> {
    analyze(data: WebsiteInfo): RuleResult {
        const viewport = data.metadata.viewport;
        const ruleContent = viewport || "";

        // No viewport meta tag — mobile-unfriendly
        if (isNULL(viewport)) {
            return {
                id: "missing-viewport",
                category: "Metadata",
                title: "Missing viewport meta tag",
                passed: false,
                severity: "error",
                score: -10,
                message:
                    "No <meta name=\"viewport\"> tag found. Without it, the page will not render properly on mobile devices, which significantly hurts mobile SEO.",
                recommendation:
                    "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> to the <head>.",
                content: ruleContent,
            };
        }

        const content = viewport!.toLowerCase().replace(/\s/g, "");

        // Check for width=device-width — the most important directive
        const hasDeviceWidth = content.includes("width=device-width");
        // Check for initial-scale
        const hasInitialScale = content.includes("initial-scale=");
        // Check for user-scalable=no — bad for accessibility
        const hasNoUserScalable =
            content.includes("user-scalable=no") ||
            content.includes("user-scalable=0");
        // Check for maximum-scale=1 — also restricts zooming
        const hasMaxScale1 = content.includes("maximum-scale=1");

        if (!hasDeviceWidth) {
            return {
                id: "viewport-no-device-width",
                category: "Metadata",
                title: "Viewport missing device-width",
                passed: false,
                severity: "error",
                score: -8,
                message: `Viewport is set to "${viewport}" but does not include "width=device-width". The page may not adapt to mobile screens.`,
                recommendation:
                    "Set viewport width to \"device-width\" for proper mobile rendering.",
                content: ruleContent,
            };
        }

        if (hasNoUserScalable || hasMaxScale1) {
            return {
                id: "viewport-zoom-disabled",
                category: "Metadata",
                title: "Viewport disables zoom",
                passed: false,
                severity: "warning",
                score: -3,
                message:
                    "The viewport meta tag disables or restricts user zooming. This is an accessibility issue that can also affect mobile SEO.",
                recommendation:
                    "Remove \"user-scalable=no\" and \"maximum-scale=1\" to allow pinch-to-zoom on mobile devices.",
                content: ruleContent,
            };
        }

        if (!hasInitialScale) {
            return {
                id: "viewport-no-initial-scale",
                category: "Metadata",
                title: "Viewport missing initial-scale",
                passed: true,
                severity: "info",
                score: 5,
                message:
                    "Viewport has width=device-width but no initial-scale. Some older browsers may not render optimally.",
                recommendation:
                    "Add \"initial-scale=1\" to the viewport meta tag for maximum browser compatibility.",
                content: ruleContent,
            };
        }

        return {
            id: "viewport-ok",
            category: "Metadata",
            title: "Viewport configuration",
            passed: true,
            severity: "info",
            score: 0,
            message:
                "Viewport is properly configured with device-width and initial-scale for responsive mobile rendering.",
            content: ruleContent,
        };
    }
}
