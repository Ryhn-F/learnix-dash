"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { ChatMessage as IChatMessage } from "@/types/chat";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { v4 as uuidv4 } from "uuid";
import { Loader2 } from "lucide-react";

export default function ChatSessionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const firstMessage = searchParams.get("firstMessage");

  const [messages, setMessages] = useState<IChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your Learnix AI Tutor. What would you like to learn about today? You can ask me to explain any topic from basic math to advanced physics.",
      timestamp: Date.now(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [hasProcessedFirstMessage, setHasProcessedFirstMessage] =
    useState(false);
  const [isNewSession, setIsNewSession] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load existing messages from Firebase
  const loadMessages = useCallback(async () => {
    try {
      const response = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      const result = await response.json();

      if (response.ok && result.data && result.data.length > 0) {
        setIsNewSession(false);
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content:
              "Hi! I'm your Learnix AI Tutor. What would you like to learn about today?",
            timestamp: Date.now(),
          },
          ...result.data,
        ]);
      }
    } catch (e) {
      console.error("Failed to load messages:", e);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Handle first message from query param (when redirected from new chat)
  useEffect(() => {
    if (
      firstMessage &&
      !hasProcessedFirstMessage &&
      !isLoadingHistory &&
      isNewSession
    ) {
      setHasProcessedFirstMessage(true);
      handleSendMessage(firstMessage);
      // Clean up the URL so refresh doesn't trigger it again
      router.replace(`/tutor/${sessionId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstMessage, hasProcessedFirstMessage, isLoadingHistory, isNewSession, sessionId, router]);

  const handleSendMessage = async (content: string) => {
    if (!sessionId) return;

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
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden bg-card border rounded-2xl shadow-sm flex flex-col relative">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
              <span className="ml-3 text-muted-foreground text-sm">
                Loading conversation...
              </span>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <ChatMessage key={msg.id || idx} message={msg} />
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
            </>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-background">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading || isLoadingHistory}
          />
        </div>
      </div>
    </div>
  );
}
