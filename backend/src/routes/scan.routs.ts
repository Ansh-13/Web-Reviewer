import express from "express"
import fs from "fs"
import supabase from "../config/supabase";
import { requireAuth } from "../middleware/auth";
import { crawl } from "../services/crawler/crawler";
import { extractWebsiteInfo } from "../services/seo/extractor";
import {seoScore} from "../services/seo/seoScore.services"


const scanRouter = express.Router()


scanRouter.post("/api/v1/scan", requireAuth, async (req, res) => {
    const rawurl = req.headers.url;
    const project_name = req.headers.project_name;
    const profile_id = res.locals.user?.uid;

    console.log("UID from middleware:", profile_id);

    const { data: user, error: err, status, statusText } = await supabase.from("profiles").select("id").eq("firebase_uid", profile_id).single()


    if (err) {
        return res.status(401).json("User not found")
    }

    const url = Array.isArray(rawurl) ? rawurl[0] : rawurl;

    const { data: projectData, error: projectError } = await supabase.from("projects").select("name, id").eq("profile_id", user.id).eq("name", project_name).maybeSingle();

    if (projectError) {
        return res.status(400).json({ "Project is not found please create a new Project": projectError })
    }

    if (projectData) {
        console.log(projectData);
    }

    if (!url) {
        return res.status(400).json({ error: "URL not found" })
    }

    try {
        const parseUrl = new URL(url)

        if (!["https:", "http:"].includes(parseUrl.protocol)) {
            return res.status(400).json({ error: "URL should be of HTTP or HTTPS Protocol only" })
        }

        const { data, error } = await supabase.from("scans").insert({ url: parseUrl.href, status: "Pending", project_id: projectData?.id });

        if (error) {
            return res.status(400).json({ "Some Went Wrong": error })
        }
        
        
        const start_time = Date.now();
        const html = await crawl(url, profile_id);
        fs.writeFileSync("crawled_page.html", html);
        const website_info = await extractWebsiteInfo(parseUrl.href, html);
        const seo_score = await seoScore(website_info);
        const end_time = Date.now();
        
        res.json({
            url: parseUrl.href,
            scanDurationMs: end_time - start_time,
            score: seo_score.score,
            grade: seo_score.grade,
            summary: seo_score.summary,
            results: seo_score.results,
        });
        
    } catch (err) {
        console.error(err);
        
        return res.status(400).json({
            error: err instanceof Error ? err.message : String(err)
        });
    }
})

export default scanRouter