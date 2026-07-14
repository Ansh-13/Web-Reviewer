import { RuleResult } from "../../seo/rules";

export function getRuleById(
    report: any,
    ruleId: string
): RuleResult | undefined {

    const allRules = [
        ...report.results.errors,
        ...report.results.warnings,
        ...report.results.passed,
    ];

    return allRules.find(rule => rule.id === ruleId);
}