import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const getGeminiModel = (temperature = 0.2) => {
  return new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    maxOutputTokens: 2048,
    temperature,
    apiKey: process.env.GEMINI_API_KEY || "dummy-key-for-build",
  });
};

export const hasGeminiConfig = !!process.env.GEMINI_API_KEY;
