// import { RuleResult } from "../../seo/rules";
// import { WebsiteSnapshot } from "../../types/website-info";
// import { OptimizerContext } from "./optimizer.types";

// export function buildContext(
//     snapshot: WebsiteSnapshot,
//     issue: RuleResult
// ): OptimizerContext {

//     const baseIssue = {
//         id: issue?.id,
//         title: issue?.title,
//         message: issue?.message,
//         recommendation: issue?.recommendation,
//         severity: issue?.severity,
//     };

//     return {
//         issue: baseIssue,
//         page: {
//             url: snapshot?.url || "Unknown URL",
//             images: snapshot?.media?.images?.items?.filter(
//                 (img: any) => !img.alt
//             ),
//         },
//     };
// }

import { RuleResult } from "../../seo/rules";
import { WebsiteSnapshot } from "../../types/website-info";
import { OptimizerContext } from "./optimizer.types";

export function buildContext(
    snapshot: WebsiteSnapshot,
    issue: RuleResult
): OptimizerContext {
    console.log(snapshot)
    const context: OptimizerContext = {
        issue: {
            id: issue.id,
            title: issue.title,
            message: issue.message,
            recommendation: issue.recommendation,
            severity: issue.severity,
        },

        page: {
            url: snapshot.url,
            pageType: snapshot.pageClassification?.type ?? "unknown",
        },

        data: {},
    };

    switch (issue.id) {

        case "missing-h1":
        case "multiple-h1":
            context.data = {
                title: snapshot.metadata.title,
                h1: snapshot.headings.h1,
                h2: snapshot.headings.h2,
                description: snapshot.metadata.description,
            };
            break;

        case "title-length":
            context.data = {
                currentTitle: snapshot.metadata?.title,
                currentLength: snapshot.metadata?.title?.length,
                h1: snapshot.headings?.h1,
                description: snapshot.metadata?.description,
            };
            break;

        case "description-length":
        case "missing-description":
            context.data = {
                title: snapshot.metadata.title,
                description: snapshot.metadata.description,
                h1: snapshot.headings.h1,
                content: snapshot.content,
            };
            break;

        case "images-missing-alt":
            context.data = {
                images: snapshot.media.images.items.filter(img => !img.alt),
                pageTitle: snapshot.metadata.title,
                h1: snapshot.headings.h1,
            };
            break;

        case "missing-structured-data":
            context.data = {
                pageType: snapshot.pageClassification.type,
                title: snapshot.metadata.title,
                description: snapshot.metadata.description,
                structuredData: snapshot.structuredData,
            };
            break;

        default:
            context.data = snapshot;
    }

    return context;
}