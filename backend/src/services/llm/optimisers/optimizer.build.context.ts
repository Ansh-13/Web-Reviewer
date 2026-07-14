import { WebsiteSnapshot } from "../../types/website-info";
import { RuleResult } from "../../seo/rules";
import { OptimizerContext } from "./optimizer.types";


export function buildContext(
    { snapshot }: WebsiteSnapshot,
    issue: RuleResult
): OptimizerContext {

    const baseIssue = {
        id: issue.id,
        title: issue.title,
        message: issue.message,
        recommendation: issue.recommendation,
        severity: issue.severity,
    };


    switch (issue.id) {

        // =============================
        // TITLE
        // =============================
        case "missing-title":
        case "title-length":
            return {
                issue: baseIssue,
                page: {
                    url: snapshot.url,
                    currentTitle: snapshot.metadata.title,
                    h1: snapshot.headings.h1,
                    description: snapshot.metadata.description,
                    wordCount: snapshot.content.wordCount,
                    language: snapshot.metadata.language,
                    pageType: snapshot.pageClassification.type,
                }
            };

        // =============================
        // META DESCRIPTION
        // =============================
        case "missing-description":
        case "description-length":
            return {
                issue: baseIssue,
                page: {
                    url: snapshot.url,
                    title: snapshot.metadata.title,
                    currentDescription: snapshot.metadata.description,
                    h1: snapshot.headings.h1,
                    wordCount: snapshot.content.wordCount,
                    language: snapshot.metadata.language,
                    pageType: snapshot.pageClassification.type,
                }
            };

        // =============================
        // CANONICAL
        // =============================
        case "missing-canonical":
        case "canonical-malformed":
            return {
                issue: baseIssue,
                page: {
                    url: snapshot.url,
                    canonical: snapshot.metadata.canonical,
                }
            };

        // =============================
        // VIEWPORT
        // =============================
        case "missing-viewport":
        case "viewport-no-device-width":
            return {
                issue: baseIssue,
                page: {
                    viewport: snapshot.metadata.viewport,
                }
            };

        // =============================
        // H1
        // =============================
        case "missing-h1":
        case "multiple-h1":
            return {
                issue: baseIssue,
                page: {
                    title: snapshot.metadata.title,
                    h1: snapshot.headings.h1,
                    h2: snapshot.headings.h2,
                    description: snapshot.metadata.description,
                    pageType: snapshot.pageClassification.type,
                }
            };

        // =============================
        // IMAGE ALT
        // =============================
        case "many-images-missing-alt":
        case "some-images-missing-alt":
            return {
                issue: baseIssue,
                page: {
                    title: snapshot.metadata.title,
                    h1: snapshot.headings.h1,
                    images: snapshot.media.images.items.filter(
                        img => !img.alt
                    ),
                }
            };

        // =============================
        // STRUCTURED DATA
        // =============================
        case "missing-structured-data":
            return {
                issue: baseIssue,
                page: {
                    url: snapshot.url,
                    title: snapshot.metadata.title,
                    description: snapshot.metadata.description,
                    h1: snapshot.headings.h1,
                    pageType: snapshot.pageClassification.type,
                }
            };

        // =============================
        // SOCIAL META
        // =============================
        case "missing-social-meta":
        case "incomplete-social-meta":
        case "missing-twitter-card":
            return {
                issue: baseIssue,
                page: {
                    title: snapshot.metadata.title,
                    description: snapshot.metadata.description,
                    openGraph: snapshot.social.openGraph,
                    twitter: snapshot.social.twitter,
                }
            };

        // =============================
        // ROBOTS
        // =============================
        case "missing-robots":
            return {
                issue: baseIssue,
                page: {
                    robots: snapshot.metadata.robots,
                }
            };

        // =============================
        // HREFLANG
        // =============================
        case "missing-x-default":
        case "no-hreflang":
            return {
                issue: baseIssue,
                page: {
                    hreflang: snapshot.hreflang,
                }
            };

        // =============================
        // THIN CONTENT
        // =============================
        case "thin-content":
            return {
                issue: baseIssue,
                page: {
                    title: snapshot.metadata.title,
                    h1: snapshot.headings.h1,
                    wordCount: snapshot.content.wordCount,
                    paragraphCount: snapshot.content.paragraphCount,
                    pageType: snapshot.pageClassification.type,
                }
            };

        // =============================
        // TOO MANY LINKS
        // =============================
        case "too-many-links":
            return {
                issue: baseIssue,
                page: {
                    totalLinks: snapshot.navigation.links.total,
                    internalLinks: snapshot.navigation.links.internal,
                    externalLinks: snapshot.navigation.links.external,
                    otherLinks: snapshot.navigation.links.other,
                }
            };

        // =============================
        // DEFAULT
        // =============================
        default:
            return {
                issue: baseIssue,
                page: snapshot,
            };
    }
}