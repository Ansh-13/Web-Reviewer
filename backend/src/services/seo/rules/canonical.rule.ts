import { WebsiteInfo } from "../../types/website-info";
import { SeoRule } from "../seoRule";
import { RuleResult } from "../rules";
import { isNULL } from "../utilities";

export class CanonicalRule implements SeoRule<WebsiteInfo> {
    analyze(data: WebsiteInfo): RuleResult {
        const canonical = data.metadata.canonical;
        const content = data.url;

        if (isNULL(canonical)) {
            return {
                id: "missing-canonical",
                category: "Metadata",
                title: "Missing canonical URL",
                passed: false,
                severity: "warning",
                score: -5,
                message:
                    "No <link rel=\"canonical\"> tag found. Search engines may index duplicate versions of this page.",
                recommendation:
                    "Add a canonical link element pointing to the preferred URL for this page.",
                content,
            };
        }

        // Validate that the canonical URL is a proper absolute URL
        try {
            const url = new URL(canonical!);

            if (!["http:", "https:"].includes(url.protocol)) {
                return {
                    id: "canonical-invalid-protocol",
                    category: "Metadata",
                    title: "Invalid canonical URL protocol",
                    passed: false,
                    severity: "error",
                    score: -8,
                    message: `Canonical URL uses an unsupported protocol: "${url.protocol}".`,
                    recommendation:
                        "Use an absolute URL with http:// or https:// as the canonical.",
                    content,
                };
            }
        } catch {
            return {
                id: "canonical-malformed",
                category: "Metadata",
                title: "Malformed canonical URL",
                passed: false,
                severity: "error",
                score: -8,
                message: `The canonical URL "${canonical}" is not a valid URL.`,
                recommendation:
                    "Ensure the canonical href is a fully-qualified absolute URL (e.g., https://example.com/page).",
                content,
            };
        }

        // Check if canonical matches the current page URL
        const normalise = (u: string) =>
            u.replace(/\/+$/, "").replace(/^https?:\/\/www\./, "https://");

        const isSelfReferencing =
            normalise(canonical!) === normalise(data.url);

        if (!isSelfReferencing) {
            return {
                id: "canonical-mismatch",
                category: "Metadata",
                title: "Canonical URL differs from page URL",
                passed: true,
                severity: "info",
                score: 0,
                message: `Canonical points to "${canonical}" which differs from the current page URL. This is valid for consolidated duplicate pages.`,
                content,
            };
        }

        return {
            id: "canonical-ok",
            category: "Metadata",
            title: "Canonical URL",
            passed: true,
            severity: "info",
            score: 0,
            message: "Self-referencing canonical URL is properly set.",
            content,
        };
    }
}
