"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
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
    <form onSubmit={handleSubmit} className="flex gap-2 items-center relative">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask anything about the topic..."
        className="flex-1 h-14 pl-5 pr-14 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400/50 transition-all font-sans text-white placeholder:text-white/30"
        disabled={isLoading}
      />
      <Button 
        type="submit" 
        size="icon"
        disabled={!message.trim() || isLoading}
        className="absolute right-1.5 h-11 w-11 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border-0 disabled:bg-white/5"
      >
        <ArrowUp size={20} className={message.trim() ? "text-indigo-400" : "text-white/40"} />
      </Button>
    </form>
  );
}
