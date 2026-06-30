import express from "express";
import { requireAuth } from "../middleware/auth";
import supabase from "../config/supabase";

const UserRouter = express.Router()

UserRouter.get("/", (req, res) => {
    async function getUserDetails() {
        const { data, error } = await supabase.from("profiles").select("*");
        if (error) {
            console.log("Error is occured :}", error)
        }
        if (data) {
            console.log(data)
        }
    }
    getUserDetails()
})


export default UserRouter