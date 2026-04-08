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

  static async generateChatTitle(firstMessage: string): Promise<string> {
    try {
      const model = getGeminiModel(0.3);
      const prompt = `Generate a very short, concise title (maximum 5 words) that summarizes the following message. Do not use quotes or any other punctuation. Just the title text.\n\nMessage: "${firstMessage}"`;
      const response = await model.invoke(prompt);
      return (response.content as string).trim();
    } catch (e) {
      console.error("Failed to generate chat title:", e);
      return "New Chat";
    }
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
      
      // Log the raw response for debugging on failure
      console.log(`[Quiz Generate] Attempt ${attempts + 1}, response length: ${textResponse.length}`);
      
      const parsedQuiz = parseQuizJSON(textResponse);
      
      return parsedQuiz;
    } catch (error: any) {
      console.error(`[Quiz Generate] Attempt ${attempts + 1} failed:`, error.message);
      
      if (attempts < 2) {
        console.warn(`Retrying quiz generation (attempt ${attempts + 2}/3)...`);
        // Add small delay between retries
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.generateQuiz(topic, difficultyStr, numQuestions, attempts + 1);
      }
      throw new Error(`Failed to generate quiz after 3 attempts: ${error.message}`);
    }
  }
}
