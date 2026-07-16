import { RuleResult } from "../../seo/rules";
import { WebsiteSnapshot } from "../../types/website-info";
import { OptimizerContext } from "./optimizer.types";

export function buildContext(
    snapshot: WebsiteSnapshot,
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
            url: snapshot?.url || "Unknown URL",
            images: snapshot?.media?.images?.items?.filter(
                (img: any) => !img.alt
            ),
        },
    };
}