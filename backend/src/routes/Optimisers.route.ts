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
        res.status(402).json("Parameters are missing")
    }

    try{

        const {data : snapshot, error : snapshotError} = await supabase.from("scan").select("Website_snapshot").eq("id",scanid).single();
        
        const {data : seoReport, error : seoReportError} = await supabase.from("scan_results").select("seo").eq("id",scanid).single();

        if(snapshotError)
        {
            console.log(`Error while fetching the snapshot : ${snapshotError}`)
            res.status(402).json("SomeThing wrong with optimiser snapshot")
        }

        if(seoReportError)
        {
            console.log(`Error while fetching the snapshot : ${snapshotError}`)
            res.status(402).json("SomeThing wrong with optimiser seo report")
        }

        const RuleResult = getRuleById(seoReport,rule)
        const optimiser_prompt = AiOptimiserPrompt(snapshot,RuleResult!);

        const response = await genratereportcomparisonResponse(optimiser_prompt)


        const aiText = response?.candidates?.[0]?.content?.parts?.[0]?.text
            ?? response?.text
            ?? null;

        return res.status(200).json( aiText );
    }   
    catch(err)
    {
        console.error("Error comparing reports:", err);
        return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
})