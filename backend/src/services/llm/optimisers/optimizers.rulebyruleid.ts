import { RuleResult } from "../../seo/rules";


export function getRuleById(
    report: any,
    ruleId: string
): RuleResult | undefined {
    console.log(ruleId);

    if (!report || !report.results) {
        console.warn("getRuleById: report or report.results is undefined", report);
        return undefined;
    }

    const allRules = [
        ...(Array.isArray(report.results.errors) ? report.results.errors : []),
        ...(Array.isArray(report.results.warnings) ? report.results.warnings : []),
        ...(Array.isArray(report.results.passed) ? report.results.passed : []),
    ];
    
    return allRules.find(rule => rule.id === ruleId);
}