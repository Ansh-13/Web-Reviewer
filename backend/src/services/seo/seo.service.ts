import * as cheerio from 'cheerio';
import { text } from 'node:stream/consumers';

export async function seoAnalyser(baseUrl : string,html : string){
    const $ = cheerio.load(html);
    const base = new URL(baseUrl);
    
    const images = $("img")
    .map((_, el) => ({
        src: $(el).attr("src"),
        alt: $(el).attr("alt"),
        loading: $(el).attr("loading"),
        width: $(el).attr("width"),
        height: $(el).attr("height")
    }))
    .get();

    const links = $("a")
    .map((_, el) => ({
        href: $(el).attr("href"),
        text: $(el).text().trim()
    }))
    .get();

    // Extract array of <h1> texts
    const h1 = $("h1")
        .map((_, el) => $(el).text().trim())
        .get();
    const h2 = $("h2")
        .map((_, el) => $(el).text().trim())
        .get();
    const h3 = $("h3")
        .map((_, el) => $(el).text().trim())
        .get();

    const internalLinks = [
        ...new Set(
            $("a")
            .map((_, el) => $(el).attr("href"))
            .get()
            .filter(Boolean)
            .map(link => {
                try {
                return new URL(link, baseUrl).href;
                } catch {
                return null;
                }
            })
            .filter(link => {
                return (
                link &&
                new URL(link).origin === base.origin &&
                !link.startsWith("mailto:") &&  
                !link.startsWith("tel:")
                );
            })
        )
        ];
    // const external = 

        const scripts: { count: number; external: string[]; inline: string[] } = {
            count: $("script").length,
            external: [] as string[],
            inline: [] as string[]
        };
            

$("script").each((_, el) => {
    const src = $(el).attr("src");

    if (src) {
        scripts.external.push(src);
    } else {
        const code = $(el).html()?.trim();

        if (code) {
            scripts.inline.push(code);
        }
    }
});

console.log(scripts);
    
    const websiteInfo = {
    title: $("title").text() || null,

    description:
        $('meta[name="description"]').attr("content") || null,

    Viewport:
        $('meta[name="viewport"]').attr("content") || null,
    
    canonical: $('link[rel="canonical"]').attr("href") || null,
    
    Language:
        $("html").attr("lang"),
    
    h1: {
        count: $("h1").length,
        tags: h1
    },

    h2: {
        count: $("h2").length,
        tags: h2
    },

    h3: {
        count: $("h3").length,
        tags: h3
    },

    charset : $("meta[charset]").attr("charset") || null,
    
    images: images,

    links: links,

    forms:
        $("form").length,

    buttons:
        $("button").length,

    scripts:
        $("script").length,

    stylesheets:
        $('link[rel="stylesheet"]').length,

    favicon:
        $('link[rel="icon"]').attr("href"),

    ogImage:
        $('meta[property="og:image"]').attr("content")
};

console.log(websiteInfo);
return websiteInfo;
}