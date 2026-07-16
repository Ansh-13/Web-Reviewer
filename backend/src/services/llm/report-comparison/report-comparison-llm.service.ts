import dotenv from "dotenv";
dotenv.config()
import {google_gemini_llm} from "../providers/gemini.provider"

export async function genrateSeoResponse(Data:string) {
    try {

        const response = await google_gemini_llm.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: Data,
        });

        if(!response){
            console.log("AI Response is not genrated");
        }

        return response;

    } catch (error){
        console.error('Error generating content:', error);
    }
}
