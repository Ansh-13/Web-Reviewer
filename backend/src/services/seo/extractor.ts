import * as cheerio from "cheerio";

export async function extractWebsiteInfo(page : string, html : string) {
    const $ = cheerio.load(html);

    const baseUrl = page;
    const base = new URL(baseUrl);

    // ========================
    // Basic Information
    // ========================
    const title = $("title").text().trim();

    const metadata = {
        charset:
            $("meta[charset]").attr("charset") ||
            $('meta[http-equiv="Content-Type"]')
                .attr("content")
                ?.match(/charset=([^;]+)/i)?.[1] ||
            null,

        viewport: $('meta[name="viewport"]').attr("content") || null,

        description:
            $('meta[name="description"]').attr("content") || null,

        keywords:
            $('meta[name="keywords"]').attr("content") || null,

        author:
            $('meta[name="author"]').attr("content") || null,

        robots:
            $('meta[name="robots"]').attr("content") || null,

        canonical:
            $('link[rel="canonical"]').attr("href") || null,

        language:
            $("html").attr("lang") || null
    };

    const metaDescription = {
        exists: $('meta[name="description"]').length > 0,
        content: $('meta[name="description"]').attr("content")?.trim() || null
    };

    // ========================
    // Headings
    // ========================
    const headings = {
        h1: $("h1")
            .map((_, el) => $(el).text().trim())
            .get(),

        h2: $("h2")
            .map((_, el) => $(el).text().trim())
            .get(),

        h3: $("h3")
            .map((_, el) => $(el).text().trim())
            .get(),

        h4: $("h4")
            .map((_, el) => $(el).text().trim())
            .get(),

        h5: $("h5")
            .map((_, el) => $(el).text().trim())
            .get(),

        h6: $("h6")
            .map((_, el) => $(el).text().trim())
            .get()
    };

    // ========================
    // Images
    // ========================
    const images = $("img")
        .map((_, el) => ({
            src: new URL($(el).attr("src") || "", baseUrl).href,
            alt: $(el).attr("alt") || "",
            loading: $(el).attr("loading") || null,
            width: $(el).attr("width") || null,
            height: $(el).attr("height") || null
        }))
        .get();

    // ========================
    // Links
    // ========================
    const internalLinks : string[] = [];
    const externalLinks : string[] = [];

    $("a").each((_, el) => {
        const href = $(el).attr("href");

        if (!href) return;

        try {
            const url = new URL(href, baseUrl);

            if (!["http:", "https:"].includes(url.protocol)) return;

            if (url.origin === base.origin) {
                internalLinks.push(url.href);
            } else {
                externalLinks.push(url.href);
            }
        } catch {}
    });

    // ========================
    // Scripts
    // ========================
    const scripts = {
        count: $("script").length,
        external: [] as string[],
        inline: [] as string[]
    };

    $("script").each((_, el) => {
    const src = $(el).attr("src");

    if (typeof src === "string") {
        scripts.external.push(new URL(src, baseUrl).href);
    } else {
        const code = $(el).html()?.trim();

        if (typeof code === "string") {
            scripts.inline.push(code);
        }
    }
    });

    // ========================
    // Stylesheets
    // ========================
    const stylesheets = $('link[rel="stylesheet"]')
    .map((_, el) => {
        const href = $(el).attr("href");
        return href ? new URL(href, baseUrl).href : null;
    })
    .get()
    .filter((href): href is string => href !== null);

    // ========================
    // Open Graph
    // ========================
    const ogImage = $('meta[property="og:image"]').attr("content");

    const openGraph = {
        title: $('meta[property="og:title"]').attr("content") ?? null,

        description:
            $('meta[property="og:description"]').attr("content") ?? null,

        image: ogImage
            ? new URL(ogImage, baseUrl).href
            : null,

        url:
            $('meta[property="og:url"]').attr("content") ?? null,

        type:
            $('meta[property="og:type"]').attr("content") ?? null,

        siteName:
            $('meta[property="og:site_name"]').attr("content") ?? null,

        locale:
            $('meta[property="og:locale"]').attr("content") ?? null
    };

    // ========================
    // Twitter Cards
    // ========================
    const twitter = {
        card: $('meta[name="twitter:card"]').attr("content") || null,

        title: $('meta[name="twitter:title"]').attr("content") || null,

        description:
            $('meta[name="twitter:description"]').attr("content") || null,

        image: $('meta[name="twitter:image"]').attr("content") || null
    };

    // ========================
    // JSON-LD
    // ========================
    const structuredData : any[] = [];

    $('script[type="application/ld+json"]').each((_, el) => {
        const json = $(el).html()?.trim();

        if (!json) return;

        try {
            structuredData.push(JSON.parse(json));
        } catch {
            structuredData.push({
                error: "Invalid JSON-LD",
                raw: json
            });
        }
    });

    // ========================
    // Forms
    // ========================
    const forms = $("form")
        .map((_, el) => ({
            action: $(el).attr("action") || "",
            method: $(el).attr("method") || "GET"
        }))
        .get();

    // ========================
    // Buttons
    // ========================
    const buttons = $("button")
        .map((_, el) => $(el).text().trim())
        .get();

    // ========================
    // Inputs
    // ========================
    const inputs = $("input")
        .map((_, el) => ({
            type: $(el).attr("type") || "text",
            name: $(el).attr("name") || "",
            required: $(el).attr("required") !== undefined
        }))
        .get();

    // ========================
    // Favicon
    // ========================
    const favicon =
        $('link[rel*="icon"]').attr("href") ||
        $('link[rel="shortcut icon"]').attr("href") ||
        null;

    // ========================
    // Hreflang / International
    // ========================
    const hreflang = $('link[rel="alternate"][hreflang]')
        .map((_, el) => ({
            href: $(el).attr("href") || null,
            hreflang: $(el).attr("hreflang") || null,
        }))
        .get();

    // ========================
    // Semantic HTML Landmarks
    // ========================
    const semanticHtml = {
        hasNav: $("nav").length > 0,
        hasMain: $("main").length > 0,
        hasHeader: $("header").length > 0,
        hasFooter: $("footer").length > 0,
        hasAside: $("aside").length > 0,
        hasArticle: $("article").length > 0,
        hasSection: $("section").length > 0,
    };

    // ========================
    // Text Content Metrics
    // ========================
    const bodyText = $("body").clone()
        .find("script, style, noscript").remove().end()
        .text().replace(/\s+/g, " ").trim();

    const contentMetrics = {
        wordCount: bodyText.length > 0 ? bodyText.split(/\s+/).length : 0,
        characterCount: bodyText.length,
        paragraphCount: $("p").length,
    };

    // ========================
    // Accessibility
    // ========================
    const accessibility = {
        ariaLabels: $("[aria-label]").length,
        ariaRoles: $("[role]").length,
        tabindexElements: $("[tabindex]").length,
    };

    // return {
    //     url: baseUrl,

    //     title,

    //     metadata,

    //     metaDescription,

    //     openGraph,

    //     twitter,

    //     headings,

    //     images: {
    //         count: images.length,
    //         items: images
    //     },

    //     links: {
    //         internal: [...new Set(internalLinks)],
    //         external: [...new Set(externalLinks)]
    //     },

    //     scripts,

    //     stylesheets,

    //     structuredData,

    //     forms,

    //     buttons,

    //     inputs,

    //     favicon
    // };

    return {
    url: baseUrl,

    metadata: {
        title,
        description: metadata.description,
        charset: metadata.charset,
        language: metadata.language,
        viewport: metadata.viewport,
        canonical: metadata.canonical,
        robots: metadata.robots,
        keywords: metadata.keywords,
        author: metadata.author,
        favicon,
        metaDescription
    },

    headings: {
        h1: {
            count: headings.h1.length,
            tags: headings.h1
        },

        h2: {
            count: headings.h2.length,
            tags: headings.h2
        },

        h3: {
            count: headings.h3.length,
            tags: headings.h3
        },

        h4: {
            count: headings.h4.length,
            tags: headings.h4
        },

        h5: {
            count: headings.h5.length,
            tags: headings.h5
        },

        h6: {
            count: headings.h6.length,
            tags: headings.h6
        }
    },

    media: {
        images: {
            count: images.length,
            items: images
        },

        videos: {
            count: $("video").length,
            items: $("video")
                .map((_, el) => ({
                    src: $(el).attr("src") || null,
                    poster: $(el).attr("poster") || null,
                    controls: $(el).attr("controls") !== undefined
                }))
                .get()
        },

        audio: {
            count: $("audio").length,
            items: $("audio")
                .map((_, el) => ({
                    src: $(el).attr("src") || null,
                    controls: $(el).attr("controls") !== undefined
                }))
                .get()
        }
    },

    navigation: {
        links: {
            count: internalLinks.length + externalLinks.length,
            internal: [...new Set(internalLinks)],
            external: [...new Set(externalLinks)]
        },

        forms: {
            count: forms.length,
            items: forms
        },

        buttons: {
            count: buttons.length,
            items: buttons
        }
    },

    resources: {
        scripts,

        stylesheets: {
            count: stylesheets.length,
            items: stylesheets
        }
    },

    social: {
        openGraph,

        twitter
    },

    structuredData: {
        count: structuredData.length,
        schemas: structuredData
    },

    performanceHints: {
        preload: $('link[rel="preload"]')
            .map((_, el) => $(el).attr("href"))
            .get()
            .filter(Boolean),

        prefetch: $('link[rel="prefetch"]')
            .map((_, el) => $(el).attr("href"))
            .get()
            .filter(Boolean),

        preconnect: $('link[rel="preconnect"]')
            .map((_, el) => $(el).attr("href"))
            .get()
            .filter(Boolean),

        dnsPrefetch: $('link[rel="dns-prefetch"]')
            .map((_, el) => $(el).attr("href"))
            .get()
            .filter(Boolean)
    },

    hreflang: {
        count: hreflang.length,
        items: hreflang
    },

    semanticHtml,

    contentMetrics,

    accessibility
};

}