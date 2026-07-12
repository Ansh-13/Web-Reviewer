import express from "express";
import { requireAuth } from "../middleware/auth";
import supabase from "../config/supabase";
import { compareReport } from "../services/report_comparison/compareReports";

const ComparisonRouter = express.Router();

ComparisonRouter.get("/api/v1/report-comparison", requireAuth, async (req, res) => {
    const currscanid = req.query.currscan;
    const prevscanid = req.query.prevscan;

    if (!currscanid) {
        return res.status(400).json({ error: "currscan query parameter is required" });
    }

    if (!prevscanid) {
        return res.status(400).json({ error: "prevscan query parameter is required" });
    }

    try {
        const { data: prevscanResult, error: prevscanResultError } = await supabase
            .from("scan_results")
            .select("seo")
            .eq("scan_id", prevscanid);

        if (prevscanResultError) {
            return res.status(500).json({ error: "Database error querying previous scan result: " + prevscanResultError.message });
        }

        if (!prevscanResult || prevscanResult.length === 0) {
            return res.status(404).json({ error: `Previous scan result not found for ID: ${prevscanid}` });
        }

        const { data: currscanResult, error: currscanResultError } = await supabase
            .from("scan_results")
            .select("seo")
            .eq("scan_id", currscanid);

        if (currscanResultError) {
            return res.status(500).json({ error: "Database error querying current scan result: " + currscanResultError.message });
        }

        if (!currscanResult || currscanResult.length === 0) {
            return res.status(404).json({ error: `Current scan result not found for ID: ${currscanid}` });
        }

        const prevScanData = prevscanResult[0]?.seo;
        const currScanData = currscanResult[0]?.seo;

        if (!prevScanData || !currScanData) {
            return res.status(400).json({ error: "Invalid scan result data found in database" });
        }

        const output = compareReport(currScanData, prevScanData);

        return res.status(200).json({ data: output });
    } catch (err) {
        console.error("Error comparing reports:", err);
        return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
});

export default ComparisonRouter;
