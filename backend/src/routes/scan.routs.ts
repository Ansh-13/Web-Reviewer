import express from "express"

import supabase from "../config/supabase";

const scanRouter = express.Router()


//Project is pending in this
scanRouter.post("/api/v1/scan", async (req, res) => {
    const rawurl = req.headers.url;

    const url = Array.isArray(rawurl) ? rawurl[0] : rawurl;

    if (!url) {
        return res.status(400).json({ error: "URL not found" })
    }

    try {
        const parseUrl = new URL(url)

        if (!["https:", "http:"].includes(parseUrl.protocol)) {
            return res.status(400).json({ error: "URL should be of HTTP or HTTPS Protocol only" })
        }

        const { data, error } = await supabase.from("scans").insert({ url: parseUrl, status: "Pending" });

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