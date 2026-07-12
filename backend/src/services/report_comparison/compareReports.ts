import { ComparisonResult } from "../types/Report-Comparison";
import { RuleResult } from "../seo/rules";

export function compareReport(currScan: any, prevScan: any): ComparisonResult {
    const currentScore = currScan?.score || 0;
    const previousScore = prevScan?.score || 0;
    const scoreDifference = currentScore - previousScore;

    const currResults: RuleResult[] = currScan?.results || [];
    const prevResults: RuleResult[] = prevScan?.results || [];

    const currMap = new Map<string, RuleResult>();
    currResults.forEach(r => {
        if (r && r.id) currMap.set(r.id, r);
    });

    const prevMap = new Map<string, RuleResult>();
    prevResults.forEach(r => {
        if (r && r.id) prevMap.set(r.id, r);
    });

    const fixed: RuleResult[] = [];
    const newIssues: RuleResult[] = [];
    const remaining: RuleResult[] = [];
    const improved: RuleResult[] = [];
    const worsened: RuleResult[] = [];

    currResults.forEach(currRule => {
        const prevRule = prevMap.get(currRule.id);
        if (prevRule) {
            // Rule existed in both
            if (!prevRule.passed && currRule.passed) {
                fixed.push(currRule);
            } else if (prevRule.passed && !currRule.passed) {
                newIssues.push(currRule);
            } else if (!prevRule.passed && !currRule.passed) {
                remaining.push(currRule);
            }

            // Check score improvement/worsening
            if (currRule.score > prevRule.score) {
                improved.push(currRule);
            } else if (currRule.score < prevRule.score) {
                worsened.push(currRule);
            }
        } else {
            // New rule in current scan
            if (!currRule.passed) {
                newIssues.push(currRule);
            }
        }
    });

    return {
        previousScore,
        currentScore,
        scoreDifference,
        fixed,
        newIssues,
        remaining,
        improved,
        worsened
    };
}