import { WebsiteInfo } from "../../types/website-info";
import { SeoRule } from "../seoRule";
import { RuleResult } from "../rules";

export class StructuredDataRule implements SeoRule<WebsiteInfo> {
    analyze(data: WebsiteInfo): RuleResult {
        const structuredData = data.structuredData;

        // No structured data at all
        if (structuredData.count === 0) {
            return {
                id: "missing-structured-data",
                category: "Structured Data",
                title: "No structured data found",
                passed: false,
                severity: "warning",
                score: -5,
                message:
                    "The page contains no JSON-LD structured data. Structured data enables rich snippets in search results (star ratings, breadcrumbs, FAQs, etc.).",
                recommendation:
                    "Add relevant Schema.org JSON-LD markup (e.g., Organization, WebPage, Article, Product, FAQ) to enhance search result appearance.",
            };
        }

        // Check for invalid JSON-LD entries (the extractor stores { error, raw } for parse failures)
        const invalidSchemas = structuredData.schemas.filter(
            (s: any) => s.error === "Invalid JSON-LD"
        );

        if (invalidSchemas.length > 0) {
            return {
                id: "invalid-structured-data",
                category: "Structured Data",
                title: "Invalid JSON-LD detected",
                passed: false,
                severity: "error",
                score: -8,
                message: `${invalidSchemas.length} of ${structuredData.count} JSON-LD blocks contain invalid JSON and will be ignored by search engines.`,
                recommendation:
                    "Validate and fix the malformed JSON-LD blocks. Use Google's Rich Results Test to verify your structured data.",
            };
        }

        // Check for @type in schemas — a valid schema should have a type
        const schemasWithType = structuredData.schemas.filter(
            (s: any) => s["@type"]
        );

        if (schemasWithType.length === 0) {
            return {
                id: "structured-data-no-type",
                category: "Structured Data",
                title: "Structured data missing @type",
                passed: false,
                severity: "warning",
                score: -3,
                message: `Found ${structuredData.count} JSON-LD block(s) but none contain a @type property. Without @type, search engines cannot interpret the data.`,
                recommendation:
                    "Ensure every JSON-LD block has a @type property (e.g., \"Organization\", \"WebPage\", \"Article\").",
            };
        }

        // Extract the types for the success message
        const types = schemasWithType.map((s: any) => s["@type"]);
        const uniqueTypes = [...new Set(types.flat())];

        return {
            id: "structured-data-ok",
            category: "Structured Data",
            title: "Structured data",
            passed: true,
            severity: "info",
            score: 10,
            message: `Found ${structuredData.count} valid JSON-LD block(s) with types: ${uniqueTypes.join(", ")}.`,
        };
    }
}
