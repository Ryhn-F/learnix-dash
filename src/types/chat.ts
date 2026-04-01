export interface ChatMessage {
  id: string | null;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  topic: string;
  messages: ChatMessage[];
  createdAt: number;
}

export interface ChatRequest {
  sessionId: string;
  message: string;
  topic: string;
}
