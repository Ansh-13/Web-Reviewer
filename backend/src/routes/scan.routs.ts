import express from "express"
import fs from "fs"
import supabase from "../config/supabase";
import { requireAuth } from "../middleware/auth";
import { crawl } from "../services/crawler/crawler";
import { extractWebsiteInfo } from "../services/seo/extractor";
import {seoScore} from "../services/seo/seoScore.services"
import {convertToWebsiteSnapshot} from '../transformers/website-snapshot'

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

        const start_time = Date.now();
        const { data : scanDetail, error  : scanDetailError } = await supabase
            .from("scans")
            .insert({ 
                url: parseUrl.href, 
                status: "Pending", 
                project_id: projectData?.id, 
                started_at: new Date(start_time).toISOString() // Use ISO string for timestamps
            })
            .select("id")
            .single();

        if (scanDetailError) {
            console.error("Error inserting scan:", scanDetailError);
            return res.status(400).json({ error: `Database insert failed: ${scanDetailError.message}` });
        }
        console.log("Inserted scan ID:", scanDetail.id);

        const html = await crawl(url, profile_id);
        fs.writeFileSync("crawled_page.html", html);
        const website_info = await extractWebsiteInfo(parseUrl.href, html);
        const seo_score = await seoScore(website_info);
        const end_time = Date.now();
        const snapshot = convertToWebsiteSnapshot(website_info)
        const { error: updateError } = await supabase
            .from("scans")
            .update({ 
                status: "Completed", 
                completed_at: new Date(end_time).toISOString(),
                website_snapshot: snapshot
            })
            .eq("id", scanDetail.id);
        
        if (updateError) {
            console.error("Error updating scan status:", updateError);
        }
        
        const { error: scanResultError } = await supabase
            .from("scan_results")
            .insert({ 
                scan_id: scanDetail.id, 
                seo: seo_score 
            });

        if (scanResultError) {
            console.error("Error inserting scan results:", scanResultError);
        }

        res.json({
            url: parseUrl.href,
            scanDurationMs: end_time - start_time,
            score: seo_score.score,
            grade: seo_score.grade,
            summary: seo_score.summary,
            results: seo_score.results,
        });
        
    } catch (err) {
        console.error("Scan general handler caught error:", err);

        return res.status(400).json({
            error: err instanceof Error ? err.message : String(err)
        });
    }
})

scanRouter.get("/api/v1/getScan", requireAuth, async(req,res) => {
    const user_id = res.locals.user?.uid;
    const project_name = req.headers.project_name;

    if(!project_name)
    {
        return res.status(400).json("Project Name is required");
    }

    const {data : projectData, error : projectError} = await supabase.from("projects").select("id, profile_id").eq("name",project_name).maybeSingle();

    if(projectError){
        console.log("projectError:", projectError)
    }

    const {data : profile_Data, error : profileError} = await supabase.from("profiles").select("id, firebase_uid").eq("id",projectData?.profile_id).maybeSingle();

    
    if(profileError){
        console.log("profileError:", profileError)
    }

    const {data : scanDetail, error : scanError} = await supabase.from("scans").select("id, url,status").eq("project_id",projectData?.id);

    if(scanError){
        console.log("scanError:", scanError)
    }

    if(!projectData?.id){
        return res.status(200).json("Enter the url to get the scan result of you website");
    }

    return res.status(200).json({data : scanDetail })
})


scanRouter.get("/api/v1/getScanResults", requireAuth, async(req,res) => {
    const scan_id = req.headers.scan_id;

    if (!scan_id) {
        console.log("Error: scan_id header is missing");
        return res.status(400).json({ error: "scan_id header is required" });
    }

    const {data : scanResult, error : scanError} = await supabase.from("scan_results").select("seo").eq("scan_id",scan_id);

    if(scanError)
    {
        return res.status(402).json({ error: scanError.message });
    }

    return res.status(200).json({data : scanResult})
})

scanRouter.get("/api/v1/getProjectScans", requireAuth, async(req, res) => {
    const scan_id = req.query.scan_id as string;

    if (!scan_id) {
        return res.status(400).json({ error: "scan_id query parameter is required" });
    }

    try {
        // Get the project_id for the given scan
        const { data: scanData, error: scanError } = await supabase
            .from("scans")
            .select("project_id, url")
            .eq("id", scan_id)
            .single();

        if (scanError || !scanData) {
            return res.status(404).json({ error: "Scan not found" });
        }

        // Get all completed scans for that project
        const { data: projectScans, error: projectScansError } = await supabase
            .from("scans")
            .select("id, url, status, started_at")
            .eq("project_id", scanData.project_id)
            .in("status", ["Completed", "Done", "completed", "done"])
            .order("started_at", { ascending: false });

        if (projectScansError) {
            return res.status(500).json({ error: projectScansError.message });
        }

        return res.status(200).json({ data: projectScans || [] });
    } catch (err) {
        return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
})

export default scanRouter