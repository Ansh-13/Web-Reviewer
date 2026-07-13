import { ComparisonResult, RuleChange, ChangeGroup } from "../types/Report-Comparison";
import { RuleResult } from "../seo/rules";

// ── Helpers ──────────────────────────────────────────────────────────────────

function gradeFromScore(score: number): string {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 60) return "C";
    if (score >= 40) return "D";
    return "F";
}

function flattenResults(scan: any): RuleResult[] {
    const r = scan?.results;
    if (!r) return [];
    if (Array.isArray(r)) return r;
    return [
        ...(Array.isArray(r.errors)   ? r.errors   : []),
        ...(Array.isArray(r.warnings) ? r.warnings : []),
        ...(Array.isArray(r.passed)   ? r.passed   : []),
    ];
}

function makeGroup(label: string, description: string, items: RuleChange[]): ChangeGroup {
    return { label, description, count: items.length, items };
}

// ── Main ─────────────────────────────────────────────────────────────────────

export function compareReport(currScan: any, prevScan: any): ComparisonResult {
    const currentScore  = currScan?.score ?? 0;
    const previousScore = prevScan?.score ?? 0;
    const delta         = currentScore - previousScore;

    const currResults = flattenResults(currScan);
    const prevResults = flattenResults(prevScan);

    // Build lookup maps keyed by rule id
    const currMap = new Map<string, RuleResult>();
    currResults.forEach(r => { if (r?.id) currMap.set(r.id, r); });

    const prevMap = new Map<string, RuleResult>();
    prevResults.forEach(r => { if (r?.id) prevMap.set(r.id, r); });

    // Categorise every rule in the current scan
    const fixed:     RuleChange[] = [];
    const newIssues: RuleChange[] = [];
    const remaining: RuleChange[] = [];
    const improved:  RuleChange[] = [];
    const worsened:  RuleChange[] = [];
    const unchanged: RuleChange[] = [];

    currResults.forEach(curr => {
        const prev = prevMap.get(curr.id);
        const scoreDelta = prev ? curr.score - prev.score : 0;

        let status: RuleChange["status"];
        let statusLabel: string;

        if (!prev) {
            // Rule only in current scan
            status      = curr.passed ? "unchanged" : "new_issue";
            statusLabel = curr.passed ? "New (passing)" : "New Issue";
        } else if (!prev.passed && curr.passed) {
            status      = "fixed";
            statusLabel = "✅ Fixed";
        } else if (prev.passed && !curr.passed) {
            status      = "new_issue";
            statusLabel = "🔴 Regression";
        } else if (!prev.passed && !curr.passed) {
            status      = "remaining";
            statusLabel = "⚠️ Still Failing";
        } else if (scoreDelta > 0) {
            status      = "improved";
            statusLabel = "📈 Improved";
        } else if (scoreDelta < 0) {
            status      = "worsened";
            statusLabel = "📉 Worsened";
        } else {
            status      = "unchanged";
            statusLabel = "➖ No Change";
        }

        const change: RuleChange = {
            id:         curr.id,
            title:      curr.title,
            category:   curr.category,
            severity:   curr.severity,
            status,
            statusLabel,
            before: {
                passed:  prev?.passed  ?? true,
                score:   prev?.score   ?? curr.score,
                message: prev?.message ?? "—",
            },
            after: {
                passed:  curr.passed,
                score:   curr.score,
                message: curr.message,
            },
            scoreDelta,
            recommendation: curr.recommendation,
        };

        if (status === "fixed")     fixed.push(change);
        else if (status === "new_issue")  newIssues.push(change);
        else if (status === "remaining")  remaining.push(change);
        else if (status === "improved")   improved.push(change);
        else if (status === "worsened")   worsened.push(change);
        else                              unchanged.push(change);
    });

    // Overall verdict
    const totalChanged = fixed.length + newIssues.length + worsened.length + improved.length;
    const verdict: ComparisonResult["meta"]["verdict"] =
        delta > 0 ? "improved" : delta < 0 ? "regressed" : "unchanged";

    const verdictMap = {
        improved:  { label: "Site improved since last scan",  emoji: "🚀" },
        regressed: { label: "Site regressed since last scan", emoji: "⚠️" },
        unchanged: { label: "No overall change detected",     emoji: "➖" },
    };

    const deltaLabel = delta === 0
        ? "No change"
        : `${delta > 0 ? "+" : ""}${delta} points (${gradeFromScore(previousScore)} → ${gradeFromScore(currentScore)})`;

    return {
        meta: {
            verdict,
            verdictLabel: verdictMap[verdict].label,
            verdictEmoji: verdictMap[verdict].emoji,
            totalChecks:   currResults.length,
            changedChecks: totalChanged,
        },
        scores: {
            previous:      previousScore,
            current:       currentScore,
            delta,
            deltaLabel,
            previousGrade: gradeFromScore(previousScore),
            currentGrade:  gradeFromScore(currentScore),
        },
        summary: {
            fixed:     fixed.length,
            newIssues: newIssues.length,
            remaining: remaining.length,
            improved:  improved.length,
            worsened:  worsened.length,
            unchanged: unchanged.length,
        },
        changes: {
            fixed:     makeGroup("Fixed Issues",       "Problems that were failing before but now pass",       fixed),
            newIssues: makeGroup("New Issues",         "Checks that were passing before but now fail",         newIssues),
            worsened:  makeGroup("Worsened",           "Checks that still fail but scored lower than before",  worsened),
            improved:  makeGroup("Improved",           "Checks that scored higher than before",                improved),
            remaining: makeGroup("Remaining Issues",   "Checks that continue to fail in both scans",          remaining),
        },
    };
}