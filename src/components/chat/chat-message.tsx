import { ChatMessage as IChatMessage } from "@/types/chat";
import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

export function ChatMessage({ message }: { message: IChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full gap-4 p-4 rounded-xl ${isUser ? "bg-muted/50" : "bg-card border"}`}>
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40" : "bg-purple-100 text-purple-600 dark:bg-purple-900/40"}`}>
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="font-medium text-sm">
          {isUser ? "You" : "Learnix Tutor"}
        </div>
        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-foreground">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
