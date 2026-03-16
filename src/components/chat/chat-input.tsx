"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask anything about the topic..."
        className="flex-1 h-12 px-4 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-sans"
        disabled={isLoading}
      />
      <Button 
        type="submit" 
        size="icon"
        disabled={!message.trim() || isLoading}
        className="h-12 w-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white"
      >
        <SendHorizontal size={20} />
      </Button>
    </form>
  );
}
