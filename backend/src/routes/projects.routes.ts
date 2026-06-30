import express from "express"
import supabase from "../config/supabase";

import { requireAuth } from "../middleware/auth";

const projectRouter = express.Router();

// Create new Project
projectRouter.post("/api/v1/create", requireAuth, async (req, res) => {
    const project_name = req.headers.project_name;
    const profile_id = req.headers.profile_id;
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
        const { data, error } = await supabase.from("projects").insert({ "profile_id": profile_id, "name": project_name, "description": description });

        if (error) {
            return res.status(400).json({ "Cannot add not project": error })
        }
        res.status(200).json("Project Added Succesfully");
    }

})

export default projectRouter;