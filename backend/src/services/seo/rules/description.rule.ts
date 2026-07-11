import { WebsiteInfo } from "../../types/website-info";
import { SeoRule } from "../seoRule";
import { RuleResult } from "../rules";
import { isNULL, hasValue, appropiateLength } from "../utilities";

export class DescriptionRule implements SeoRule<WebsiteInfo> {
    analyze(data: WebsiteInfo): RuleResult {
        const description = data.metadata.description;
        const content = description || "";

        if (isNULL(description)) {
            return {
                id: "missing-description",
                category: "Metadata",
                title: "Missing meta description",
                passed: false,
                severity: "error",
                score: -10,
                message:
                    "The page does not contain a <meta name=\"description\"> tag.",
                recommendation:
                    "Add a unique, compelling meta description between 120–160 characters that summarizes the page content.",
                content,
            };
        }

        if (!hasValue(description!)) {
            return {
                id: "empty-description",
                category: "Metadata",
                title: "Empty meta description",
                passed: false,
                severity: "error",
                score: -10,
                message:
                    "The <meta name=\"description\"> tag exists but has no content.",
                recommendation:
                    "Write a descriptive summary of 120–160 characters for the meta description.",
                content,
            };
        }

        if (appropiateLength(description!, 160, 120)) {
            const len = description!.length;
            const detail =
                len < 120
                    ? `Too short (${len} characters). Search engines may generate their own snippet.`
                    : `Too long (${len} characters). It will likely be truncated in search results.`;

            return {
                id: "description-length",
                category: "Metadata",
                title: "Meta description length",
                passed: false,
                severity: "warning",
                score: -5,
                message: `${detail} Recommended length is 120–160 characters.`,
                recommendation:
                    "Rewrite the meta description to fall within 120–160 characters.",
                content,
            };
        }

        return {
            id: "description-ok",
            category: "Metadata",
            title: "Meta description",
            passed: true,
            severity: "info",
            score: 0,
            message: `Meta description is present and has an optimal length (${description!.length} characters).`,
            content,
        };
    }
}
