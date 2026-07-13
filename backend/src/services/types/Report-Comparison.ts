import { RuleResult } from "../seo/rules";

/** A single rule compared across two scans */
export interface RuleChange {
    id: string;
    title: string;
    category: string;
    severity: "info" | "warning" | "error";
    status: "fixed" | "new_issue" | "remaining" | "improved" | "worsened" | "unchanged";
    statusLabel: string;
    before: { passed: boolean; score: number; message: string };
    after:  { passed: boolean; score: number; message: string };
    scoreDelta: number;
    recommendation?: string;
}

/** Grouped section of rule changes */
export interface ChangeGroup {
    label: string;
    description: string;
    count: number;
    items: RuleChange[];
}

/** Top-level comparison response */
export interface ComparisonResult {
    meta: {
        verdict: "improved" | "regressed" | "unchanged";
        verdictLabel: string;
        verdictEmoji: string;
        totalChecks: number;
        changedChecks: number;
    };
    scores: {
        previous: number;
        current: number;
        delta: number;
        deltaLabel: string;
        previousGrade: string;
        currentGrade: string;
    };
    summary: {
        fixed: number;
        newIssues: number;
        remaining: number;
        improved: number;
        worsened: number;
        unchanged: number;
    };
    changes: {
        fixed:     ChangeGroup;
        newIssues: ChangeGroup;
        worsened:  ChangeGroup;
        improved:  ChangeGroup;
        remaining: ChangeGroup;
    };
}