import express from "express"
import supabase from "../config/supabase";

import { requireAuth } from "../middleware/auth";

const projectRouter = express.Router();

// Create new Project
projectRouter.post("/api/v1/create", requireAuth, async (req, res) => {
    const project_name = req.headers.project_name;
    const profile_id = res.locals.user?.uid;
    const description = req.headers.description;

    if (!project_name) {
        return res.json(400).json("Please Provide the project name")
    }

    const { data, error } = await supabase.from("projects").select("*").eq("name", project_name).maybeSingle();

    if (error) {
        res.json({ "something wrong in checking the project entry in db": error })
    }
    if (data) {
        return res.status(409).json("Please Provide unique Project Name")
    }
    if (!data) {

        const { data: userData, error: userError } = await supabase.from("profiles").select("id").eq("firebase_uid", profile_id).maybeSingle()

        if (userError) {
            return res.status(400).json({ "Cannot find the user in Supabase": userError })
        }

        if (!userData) {
            return res.status(401).json("Please SignIn Before making this request")
        }

        if (userData) {
            const { data, error } = await supabase.from("projects").insert({ "profile_id": userData.id, "name": project_name, "description": description });

            if (error) {
                return res.status(400).json({ "Cannot add not project": error })
            }
            return res.status(200).json("Project Added Succesfully");
        }
    }
})

projectRouter.get("/api/v1/getprojects", requireAuth, async(req, res) => {
    const user_id = res.locals.user?.uid;

    const {data : userData , error : userError} = await supabase.from("profiles").select("id").eq("firebase_uid",user_id).maybeSingle();

    if(userData == null){
        return res.status(401).json("Please login before creating Projects");
    }

    if(userError){
        console.log(userError)
    }

    const { data, error } = await supabase.from("projects").select("id, name, description, created_at").eq("profile_id", userData.id);
    console.log(data)

    if (error) {
        console.log(error)
    }

    if (!data) {
        return res.json("Please create a Project");
    }

    res.status(200).json({ data });
})

projectRouter.get("/api/project/info", requireAuth, async (req, res) => {
    const projectid = (req.query.projectid as string) || req.body?.projectid;

    if (!projectid) {
        return res.status(400).json("projectid is required");
    }

    try {
        const { count: countscan, error: countscanerror } = await supabase
            .from("scans")
            .select("*", { count: "exact", head: true })
            .eq("project_id", projectid);

        const { data: latestScanID, error: latestScanIDError } = await supabase
            .from("scans")
            .select("id")
            .eq("project_id", projectid)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        const { data: seodata, error: seoDataError } = await supabase
            .from("scan_results")
            .select("seo")
            .eq("scan_id", latestScanID?.id)
            .maybeSingle();

        if (countscanerror || seoDataError || latestScanIDError) {
            console.log({ "There has been some error": countscanerror, seoDataError, latestScanIDError });
        }

        if (!seodata) {
            return res.status(200).json({
                count: countscan || 0,
                data: null
            });
        }

        const seoObj = seodata?.seo;
        let issuesCount: number | null = null;

        if (seoObj) {
            if (seoObj.issues !== undefined && seoObj.issues !== null) {
                issuesCount = Array.isArray(seoObj.issues) ? seoObj.issues.length : Number(seoObj.issues);
            } else if (seoObj.summary) {
                issuesCount = (seoObj.summary.errors || 0) + (seoObj.summary.warnings || 0);
            } else if (seoObj.results) {
                const errCount = Array.isArray(seoObj.results.errors) ? seoObj.results.errors.length : 0;
                const warnCount = Array.isArray(seoObj.results.warnings) ? seoObj.results.warnings.length : 0;
                issuesCount = errCount + warnCount;
            }
        }

        return res.status(200).json({
            count: countscan || 0,
            data: {
                score: seoObj?.score ?? null,
                grade: seoObj?.grade ?? null,
                issues: issuesCount
            }
        });
    }
    catch (error) {
        return res.status(500).json("Internal Server Error");
    }
})

export default projectRouter;