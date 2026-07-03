import { chromium } from "playwright";

export async function crawl(url: string, user_id: string) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: "networkidle" });
        const html: string = await page.content();
        // console.log(html)
        return html;
    }
    finally {
        await browser.close();
    }
}