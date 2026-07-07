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