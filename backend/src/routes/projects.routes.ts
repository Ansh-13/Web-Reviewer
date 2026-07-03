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

export default projectRouter;