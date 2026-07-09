import express, { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {buildSeoPrompt} from "../services/llm/prompts/seo.prompt"
import supabase from "../config/supabase";
import {genrateSeoResponse} from "../services/llm/llm.service"

const AIRouter =  Router();

AIRouter.get("/api/v1/ai/",requireAuth, async(req,res) => {
    const scan_ID = req.query.scanid

    if(!scan_ID)
    {
        return res.status(400).json("Please provide the scan id for which you want to genrate the AI report")
    }

    const {data : scanResult, error : scanResuktError} = await supabase.from("scan_results").select("seo").eq("scan_id",scan_ID);

    if(scanResuktError)
    {
        return res.status(400).json({"Something went wrong" : scanResuktError});
    }

    if (!scanResult || scanResult.length === 0) {
        return res.status(404).json("Scan result not found");
    }

    const prompt : string =  buildSeoPrompt(scanResult);

    const response = await genrateSeoResponse(prompt);

    return res.status(200).json({Data : response})

})

export default AIRouter;