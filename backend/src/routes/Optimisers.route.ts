import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import supabase from "../config/supabase";
import {getRuleById} from "../services/llm/optimisers/optimizers.rulebyruleid"
import { AiOptimiserPrompt } from "../services/llm/optimisers/optimizer.prompt";
import {genratereportcomparisonResponse} from "../services/llm/optimisers/optimizer.service"

const optimisersRouter =  Router()

optimisersRouter.post("/api/v1/optimiser",requireAuth, async (req,res) => {
    const scanid = req.body.scanid;
    const rule = req.body.rule;

    if(!scanid || !rule)
    {
        return res.status(402).json("Parameters are missing")
    }

    try{

        // Fetch scan details (to get the URL/HTML if needed, using 'scans' table)
        const {data : snapshot, error : snapshotError} = await supabase.from("scans").select("website_snapshot").eq("id",scanid).single();
        
        // Fetch SEO report using 'scan_id' foreign key
        const {data : seoReport, error : seoReportError} = await supabase.from("scan_results").select("seo").eq("scan_id",scanid).single();

        if(snapshotError)
        {
            console.log(`Error while fetching the snapshot : ${snapshotError.message || snapshotError}`)
            return res.status(402).json("Something went wrong with optimiser snapshot: " + (snapshotError.message || ""));
        }

        if(seoReportError)
        {
            console.log(`Error while fetching the seo report : ${seoReportError.message || seoReportError}`)
            return res.status(402).json("Something went wrong with optimiser seo report: " + (seoReportError.message || ""));
        }
        // Extract and parse the SEO data if it's a string
        let seoData = seoReport?.seo;
        if (typeof seoData === 'string') {
            try {
                seoData = JSON.parse(seoData);
            } catch(e) {
                console.error("Error parsing seoReport.seo:", e);
            }
        }

        let websiteSnapshot = snapshot?.website_snapshot;
        if (typeof websiteSnapshot === 'string') {
            try {
                websiteSnapshot = JSON.parse(websiteSnapshot);
            } catch(e) {
                console.error("Error parsing websiteSnapshot:", e);
            }
        }

        const RuleResult = getRuleById(seoData, rule);
        const optimiser_prompt = AiOptimiserPrompt(websiteSnapshot, RuleResult!);

        const response = await genratereportcomparisonResponse(optimiser_prompt)
        const aiText = response?.candidates?.[0]?.content?.parts?.[0]?.text
            ?? response?.text
            ?? null;
        console.log(aiText)
        return res.status(200).json( aiText );
    }   
    catch(err)
    {
        console.error("Error comparing reports:", err);
        return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
})

export default optimisersRouter;