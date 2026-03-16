"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage as IChatMessage } from "@/types/chat";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { v4 as uuidv4 } from "uuid";

export default function TutorPage() {
  const [messages, setMessages] = useState<IChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your Learnix AI Tutor. What would you like to learn about today? You can ask me to explain any topic from basic math to advanced physics.",
      timestamp: Date.now(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionObj, setSessionObj] = useState(null);
  const [sessionId, setSessionId] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSessionId(uuidv4());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMsg: IChatMessage = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: content,
          topic: "General",
          history: messages,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            role: "assistant",
            content: data.result || "Sorry, I couldn't generate a response.",
            timestamp: Date.now(),
          },
        ]);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: "assistant",
          content:
            "**Error:** Sorry, there was an issue processing your request. Please try again.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">AI Tutor</h1>
        <p className="text-muted-foreground mt-1">
          Chat naturally to understand any topic deeply.
        </p>
      </div>

      <div className="flex-1 overflow-hidden bg-card border rounded-2xl shadow-sm flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex gap-4 p-4 rounded-xl bg-card border w-32 items-center justify-center">
              <div className="flex space-x-1.5 animate-pulse">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animation-delay-200"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animation-delay-400"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t bg-background">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
