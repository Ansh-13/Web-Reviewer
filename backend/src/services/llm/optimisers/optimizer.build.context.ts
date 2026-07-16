import { RuleResult } from "../../seo/rules";
import { OptimizerContext } from "./optimizer.types";

export function buildContext(
    snapshotData: any,
    issue: RuleResult
): OptimizerContext {

    const baseIssue = {
        id: issue?.id,
        title: issue?.title,
        message: issue?.message,
        recommendation: issue?.recommendation,
        severity: issue?.severity,
    };

    return {
        issue: baseIssue,
        page: {
            url: snapshotData?.url || "Unknown URL",
        },
    };
}