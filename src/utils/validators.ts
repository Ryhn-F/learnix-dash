import { z } from "zod";

export const QuizQuestionSchema = z.object({
  id: z.string().optional(),
  question: z.string(),
  options: z.array(z.string()).length(4),
  answer: z.string(),
  explanation: z.string(),
});

export const QuizSchema = z.object({
  type: z.literal("quiz"),
  topic: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  questions: z.array(QuizQuestionSchema),
});

export const GenerateQuizInputSchema = z.object({
  topic: z.string().min(2),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  numQuestions: z.number().min(1).max(10).default(5),
});
