import { getGeminiModel } from "../lib/gemini/gemini";
import { quizPromptTemplate } from "../prompts/quiz.prompt";
import { tutorPromptTemplate } from "../prompts/tutor.prompt";
import { parseQuizJSON } from "../utils/parser";
import { ChatMessage } from "../types/chat";

import { Quiz } from "../types/quiz";

export class AIService {
  static async chatWithTutor(topic: string, question: string, history: ChatMessage[]) {
    const model = getGeminiModel(0.7);

    // Format history for Langchain
    const formattedHistory = history.map((msg) => [msg.role, msg.content]);

    const prompt = await tutorPromptTemplate.formatMessages({
      topic: topic || "General Learning",
      history: formattedHistory,
      question: question,
    });

    const response = await model.invoke(prompt);
    return response.content;
  }

  static async generateQuiz(topic: string, difficultyStr: string, numQuestions: number, attempts = 0): Promise<Quiz> {
    try {
      const model = getGeminiModel(0.2);
      
      const promptText = await quizPromptTemplate.format({
        topic,
        difficulty: difficultyStr,
        numQuestions,
      });

      const result = await model.invoke(promptText);
      
      const textResponse = result.content as string;
      const parsedQuiz = parseQuizJSON(textResponse);
      
      return parsedQuiz;
    } catch (error) {
      if (attempts < 2) {
        console.warn(`Retry attempt ${attempts + 1} for generateQuiz...`);
        return this.generateQuiz(topic, difficultyStr, numQuestions, attempts + 1);
      }
      throw new Error("Failed to generate a valid quiz. Please try again.");
    }
  }
}
