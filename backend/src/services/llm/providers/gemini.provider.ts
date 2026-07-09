import dotenv from "dotenv";
dotenv.config()

import { GoogleGenAI } from "@google/genai";

export const google_gemini_llm = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

