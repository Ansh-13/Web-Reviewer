import { RuleResult } from "../seo/rules";

export interface ComparisonResult {
    previousScore: number;
    currentScore: number;
    scoreDifference: number;

    fixed: RuleResult[];
    newIssues: RuleResult[];
    remaining: RuleResult[];
    improved: RuleResult[];
    worsened: RuleResult[];
}