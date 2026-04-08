import { PromptTemplate } from "@langchain/core/prompts";

export const quizPromptTemplate = PromptTemplate.fromTemplate(`
You are an expert AI tutor that generates quiz questions.

Generate exactly {numQuestions} multiple choice questions about: "{topic}"
Difficulty level: {difficulty}

Rules:
1. Each question MUST have exactly 4 options.
2. The "answer" field MUST exactly match one of the 4 options.
3. Include a brief educational explanation for each answer.
4. Questions should test understanding, not just memorization.

CRITICAL: You MUST respond with ONLY a valid JSON object. No markdown, no code fences, no explanation text before or after. Just pure JSON.

The JSON must follow this exact structure:
{{
  "type": "quiz",
  "topic": "{topic}",
  "difficulty": "{difficulty}",
  "questions": [
    {{
      "question": "What is ...?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A",
      "explanation": "Option A is correct because ..."
    }}
  ]
}}

Respond with ONLY the JSON object, nothing else.
`);
