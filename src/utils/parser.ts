import { z } from "zod";
import { QuizSchema } from "./validators";

export const parseQuizJSON = (text: string) => {
  try {
    // Step 1: Try to extract JSON from markdown code blocks (greedy match for nested objects)
    const jsonCodeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    let jsonString = jsonCodeBlockMatch ? jsonCodeBlockMatch[1].trim() : text.trim();

    // Step 2: If still not clean JSON, try to find the JSON object boundaries
    if (!jsonString.startsWith("{")) {
      const firstBrace = jsonString.indexOf("{");
      const lastBrace = jsonString.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonString = jsonString.substring(firstBrace, lastBrace + 1);
      }
    }

    // Step 3: Clean up common issues from AI output
    // Remove trailing commas before closing brackets/braces
    jsonString = jsonString.replace(/,\s*([}\]])/g, "$1");
    // Remove any BOM or invisible characters
    jsonString = jsonString.replace(/^\uFEFF/, "");

    // Step 4: Parse string to object
    const parsed = JSON.parse(jsonString);

    // Step 5: Validate with Zod
    return QuizSchema.parse(parsed);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Quiz schema validation failed:", JSON.stringify(error.issues, null, 2));
      throw new Error(`Invalid AI generated quiz format: ${error.issues.map(i => i.message).join(", ")}`);
    }
    if (error instanceof SyntaxError) {
      console.error("JSON parse error:", error.message);
      console.error("Raw text (first 500 chars):", text.substring(0, 500));
      throw new Error(`Failed to parse AI response as JSON: ${error.message}`);
    }
    console.error("Failed to parse AI response:", text.substring(0, 500));
    throw new Error("Failed to parse AI response as JSON");
  }
};
