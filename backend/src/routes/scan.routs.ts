import express from "express"
import supabase from "../config/supabase";
import { profile } from "node:console";
import { requireAuth } from "../middleware/auth";

const scanRouter = express.Router()

//Project is pending in this
scanRouter.post("/api/v1/scan", requireAuth, async (req, res) => {
    const rawurl = req.headers.url;
    const project_name = req.headers.project_name;
    const profile_id = res.locals.user?.uid;

    console.log("UID from middleware:", profile_id);

    const { data: user, error: err, status, statusText } = await supabase.from("profiles").select("id").eq("firebase_uid", profile_id).single()

    console.log("Supabase profile query →", { status, statusText, err, user });

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

        const { data, error } = await supabase.from("scans").insert({ url: parseUrl, status: "Pending", project_id: projectData?.id });

        if (error) {
            return res.status(400).json({ "Some Went Wrong": error })
        }

        res.json({
            message: "Scan is Pending",
            url: parseUrl.href
        });

    } catch (err) {
        return res.json({ status: 400, error: "SomeThing with the URL" })
    }
})

export default scanRouter