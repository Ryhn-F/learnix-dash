import { z } from "zod";
import { QuizSchema } from "./validators";

export const parseQuizJSON = (text: string) => {
  try {
    // Attempt to extract JSON if it's wrapped in markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;

    // Parse string to object
    const parsed = JSON.parse(jsonString);

    // Validate with Zod
    return QuizSchema.parse(parsed);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Quiz schema validation failed", error.issues);
      throw new Error("Invalid AI generated quiz format");
    }
    console.error("Failed to parse AI response as JSON", text);
    throw new Error("Failed to parse AI as JSON");
  }
};
