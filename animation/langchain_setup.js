import { configDotenv } from "dotenv";
configDotenv();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
    model: process.env.model_name,
    apiKey: process.env.api_key,
    project: process.env.project_name,
    temperature: 0.3, // focused, factual <----> creative, diversed [0,1]
    maxRetries: 2,
    // ... other parameters
});

export {
    model,
}