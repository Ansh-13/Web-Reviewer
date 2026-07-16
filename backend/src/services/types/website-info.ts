export interface WebsiteInfo {
    url: string;

    metadata: {
        title: string | null;
        description: string | null;
        charset: string | null;
        language: string | null;
        viewport: string | null;
        canonical: string | null;
        robots: string | null;
        keywords: string | null;
        author: string | null;
        favicon: string | null;
        metaDescription: { exists: boolean | null; content: string | null };
    };

    headings: {
        h1: { count: number; tags: string[] };
        h2: { count: number; tags: string[] };
        h3: { count: number; tags: string[] };
        h4: { count: number; tags: string[] };
        h5: { count: number; tags: string[] };
        h6: { count: number; tags: string[] };
    };

    media: {
        images: {
            count: number;
            items: {
                src: string;
                alt: string;
                loading: string | null;
                width: string | null;
                height: string | null;
            }[];
        };
        videos: {
            count: number;
            items: {
                src: string | null;
                poster: string | null;
                controls: boolean;
            }[];
        };
        audio: {
            count: number;
            items: {
                src: string | null;
                controls: boolean;
            }[];
        };
    };

    navigation: {
        links: {
            count: number;
            internal: string[];
            external: string[];
        };
        forms: {
            count: number;
            items: { action: string; method: string }[];
        };
        buttons: {
            count: number;
            items: string[];
        };
    };

    resources: {
        scripts: {
            count: number;
            external: string[];
            inline: string[];
        };
        stylesheets: {
            count: number;
            items: string[];
        };
    };

    social: {
        openGraph: {
            title: string | null;
            description: string | null;
            image: string | null;
            url: string | null;
            type: string | null;
            siteName: string | null;
            locale: string | null;
        };
        twitter: {
            card: string | null;
            title: string | null;
            description: string | null;
            image: string | null;
        };
    };

    structuredData: {
        count: number;
        schemas: any[];
    };

    performanceHints: {
        preload: string[];
        prefetch: string[];
        preconnect: string[];
        dnsPrefetch: string[];
    };

    hreflang: {
        count: number;
        items: {
            href: string | null;
            hreflang: string | null;
        }[];
    };

    semanticHtml: {
        hasNav: boolean;
        hasMain: boolean;
        hasHeader: boolean;
        hasFooter: boolean;
        hasAside: boolean;
        hasArticle: boolean;
        hasSection: boolean;
    };

    contentMetrics: {
        wordCount: number;
        characterCount: number;
        paragraphCount: number;
    };

    accessibility: {
        ariaLabels: number;
        ariaRoles: number;
        tabindexElements: number;
    };
}

export interface WebsiteSnapshot {
    version: number;

    url: string;

    scannedAt: string;

    seo: {
        titleExists: boolean;
        titleLength: number;

        descriptionExists: boolean;
        descriptionLength: number;

        canonicalExists: boolean;
        robotsExists: boolean;
    };

    pageClassification: {
        type:
            | "landing-page"
            | "blog"
            | "portfolio"
            | "documentation"
            | "ecommerce"
            | "article"
            | "unknown";
    };

    metadata: {
        title: string | null;
        description: string | null;
        charset: string | null;
        language: string | null;
        viewport: string | null;
        canonical: string | null;
        robots: string | null;
        keywords: string | null;
        author: string | null;
        favicon: string | null;
    };

    headings: {
        h1: {
            count: number;
            tags: string[];
        };

        h2: {
            count: number;
            tags: string[];
        };

        h3: {
            count: number;
            tags: string[];
        };

        h4: {
            count: number;
            tags: string[];
        };

        h5: {
            count: number;
            tags: string[];
        };

        h6: {
            count: number;
            tags: string[];
        };
    };

    content: {
        wordCount: number;
        characterCount: number;
        paragraphCount: number;
    };

    media: {
        images: {
            total: number;
            missingAlt: number;
            
            items: {
                src: string;
                alt: string | null;
            }[];
        };

        videos: {
            total: number;
        };

        audio: {
            total: number;
        };
    };

    navigation: {
        links: {
            total: number;
            internal: number;
            external: number;
            other: number;
        };

        forms: number;

        buttons: number;
    };

    resources: {
        scripts: {
            total: number;
            external: number;
            inline: number;
        };

        stylesheets: {
            total: number;
        };
    };

    social: {
        openGraph: {
            title: string | null;
            description: string | null;
            image: string | null;
            url: string | null;
            type: string | null;
            siteName: string | null;
            locale: string | null;
        };

        twitter: {
            card: string | null;
            title: string | null;
            description: string | null;
            image: string | null;
        };
    };

    structuredData: {
        count: number;
        types: string[];
    };

    hreflang: {
        count: number;
        hasXDefault: boolean;
    };

    semanticHtml: {
        hasNav: boolean;
        hasMain: boolean;
        hasHeader: boolean;
        hasFooter: boolean;
        hasAside: boolean;
        hasArticle: boolean;
        hasSection: boolean;
    };

    accessibility: {
        ariaLabels: number;
        ariaRoles: number;
        tabindexElements: number;
    };

    performanceHints: {
        preloadCount: number;
        prefetchCount: number;
        preconnectCount: number;
        dnsPrefetchCount: number;
    };
}