import { WebsiteInfo } from "../services/types/website-info";
import { WebsiteSnapshot } from "../services/types/website-info";

const SNAPSHOT_VERSION = 1;

function normalize(value?: string | null): string | null {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
}

export function convertToWebsiteSnapshot(
    info: WebsiteInfo
): WebsiteSnapshot {

    const images = info.media.images.items ?? [];

    const imageStats = images.reduce(
        (stats, img) => {

            const alt = img.alt;

            if (!alt) {
                stats.missingAlt++;
            }

            stats.items.push({
                src: img.src,
                alt: img.alt
            });

            return stats;
        },
        {
            missingAlt: 0,
            items: [] as WebsiteSnapshot["media"]["images"]["items"],
        }
    );

    const structuredTypes = [
        ...new Set(
            (info.structuredData.schemas ?? [])
                .flatMap(schema => {
                    const type = schema["@type"] ?? schema.type;

                    if (!type) {
                        return [];
                    }

                    return Array.isArray(type) ? type : [type];
                })
                .filter(Boolean)
        ),
    ];

    const title = normalize(info.metadata.title);
    const description = normalize(info.metadata.description);
    const canonical = normalize(info.metadata.canonical);
    const robots = normalize(info.metadata.robots);

    return {
        version: SNAPSHOT_VERSION,

        url: info.url,

        scannedAt: new Date().toISOString(),

        seo: {
            titleExists: !!title,
            titleLength: title?.length ?? 0,

            descriptionExists: !!description,
            descriptionLength: description?.length ?? 0,

            canonicalExists: !!canonical,
            robotsExists: !!robots,
        },

        pageClassification: {
            type: "unknown",
        },

        metadata: {
            title,
            description,
            charset: normalize(info.metadata.charset),
            language: normalize(info.metadata.language),
            viewport: normalize(info.metadata.viewport),
            canonical,
            robots,
            keywords: normalize(info.metadata.keywords),
            author: normalize(info.metadata.author),
            favicon: normalize(info.metadata.favicon),
        },

        headings: {
            h1: {
                count: info.headings.h1.count,
                tags: info.headings.h1.tags,
            },

            h2: {
                count: info.headings.h2.count,
                tags: info.headings.h2.tags,
            },

            h3: {
                count: info.headings.h3.count,
                tags: info.headings.h3.tags,
            },

            h4: {
                count: info.headings.h4.count,
                tags: info.headings.h4.tags,
            },

            h5: {
                count: info.headings.h5.count,
                tags: info.headings.h5.tags,
            },

            h6: {
                count: info.headings.h6.count,
                tags: info.headings.h6.tags,
            },
        },

        content: {
            wordCount: info.contentMetrics.wordCount,
            characterCount: info.contentMetrics.characterCount,
            paragraphCount: info.contentMetrics.paragraphCount,
        },

        media: {
            images: {
                total: info.media.images.count,
                missingAlt: imageStats.missingAlt,

                items: imageStats.items
            },

            videos: {
                total: info.media.videos.count,
            },

            audio: {
                total: info.media.audio.count,
            },
        },

        navigation: {
            links: {
                total: info.navigation.links.count,
                internal: info.navigation.links.internal.length,
                external: info.navigation.links.external.length,
                other:
                    info.navigation.links.count -
                    info.navigation.links.internal.length -
                    info.navigation.links.external.length,
            },

            forms: info.navigation.forms.count,

            buttons: info.navigation.buttons.count,
        },

        resources: {
            scripts: {
                total: info.resources.scripts.count,
                external: info.resources.scripts.external.length,
                inline: info.resources.scripts.inline.length,
            },

            stylesheets: {
                total: info.resources.stylesheets.count,
            },
        },

        social: {
            openGraph: {
                ...info.social.openGraph,
            },

            twitter: {
                ...info.social.twitter,
            },
        },

        structuredData: {
            count: info.structuredData.count,
            types: structuredTypes,
        },

        hreflang: {
            count: info.hreflang.count,

            hasXDefault: info.hreflang.items.some(
                item => item.hreflang?.toLowerCase() === "x-default"
            ),
        },

        semanticHtml: {
            ...info.semanticHtml,
        },

        accessibility: {
            ...info.accessibility,
        },

        performanceHints: {
            preloadCount: info.performanceHints.preload.length,
            prefetchCount: info.performanceHints.prefetch.length,
            preconnectCount: info.performanceHints.preconnect.length,
            dnsPrefetchCount: info.performanceHints.dnsPrefetch.length,
        },
    };
}