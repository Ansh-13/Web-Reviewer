import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import cors from "cors";
import { requireAuth } from "./middleware/auth";
import supabase from "./config/supabase";

//All Routes
import UserRouter from "./routes/auth.routes";
import scanRouter from "./routes/scan.routs";
import projectRouter from "./routes/projects.routes";
import AIRouter from "./routes/AI.routes";
<<<<<<< HEAD
import optimisersRouter from "./routes/Optimisers.route";
=======
import ComparisonRouter from "./routes/report.comparison";
>>>>>>> Report-Comparison

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:4321",
    credentials: true
}))
app.use(express.json());

app.use(UserRouter)
app.use(scanRouter)
app.use(projectRouter)
app.use(AIRouter)
<<<<<<< HEAD
app.use(optimisersRouter)
=======
app.use(ComparisonRouter)
>>>>>>> Report-Comparison

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.get("/api/profile", requireAuth, async (req, res) => {
    const user = res.locals.user;

    const { data, error } = await supabase.from("profiles").select("*").eq("firebase_uid", user.uid).maybeSingle()
    if (error) {
        console.log("There has been some error during finding the uid in supabase", { error })
        res.json({ status: 500 });
    }

    if (!data) {
        const { error: insetError } = await supabase.from("profiles").insert({ firebase_uid: user.uid, email: user.email, display_name: user.name, photo_url: user.picture })

        if (insetError) {
            console.log({ insetError })
        }
    }

    console.log(user)
    res.json({ uid: user.uid, email: user.email })
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});