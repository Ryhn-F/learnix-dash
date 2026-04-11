"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChatMessage as IChatMessage } from "@/types/chat";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { v4 as uuidv4 } from "uuid";
import { Sparkles, MessageSquareText, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/components/motion/variants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function TutorPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (isCreatingSession) return;
    setIsCreatingSession(true);

    try {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 12000); // 12s timeout

      // Get user from localStorage
      const stored = localStorage.getItem("user");
      if (!stored) {
        clearTimeout(timeoutId);
        router.push("/login");
        return;
      }
      const user = JSON.parse(stored);

      // 1. Create Firebase session via existing create-session API
      const createRes = await fetch("/api/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          topic: "general",
        }),
        signal: abortController.signal,
      });

      if (!createRes.ok) throw new Error("API returned an error");

      const createResult = await createRes.json();
      const firebaseSessionId = createResult.data.id;

      // 2. Save session reference to Supabase sessions_chat table
      const supabaseRes = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: firebaseSessionId,
          userId: user.id,
          firstMessage: content,
        }),
        signal: abortController.signal,
      });

      if (!supabaseRes.ok) throw new Error("API returned an error connecting to DB");

      clearTimeout(timeoutId);

      // 3. Navigate to the session page and pass the first message via query param
      const encodedMessage = encodeURIComponent(content);
      router.push(`/tutor/${firebaseSessionId}?firstMessage=${encodedMessage}`);
    } catch (e: any) {
      console.error("Failed to create session:", e);
      setIsCreatingSession(false);
      
      if (e.name === "AbortError" || e.message === "AbortError") {
        setErrorMessage("The AI Tutor is taking too long to respond. This might happen if the AI server is busy or your connection is slow. Please try again.");
      } else {
        setErrorMessage("Failed to start a new chat session. Please verify your connection and try again.");
      }
      setShowErrorModal(true);
    }
  };

  return (
    <main className="flex flex-col h-full">
      {/* Chat area or empty state */}
      <div className="flex-1 overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-500/10 flex flex-col relative z-10">
        {messages.length === 0 ? (
          /* Empty State — New Chat Welcome */
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2 text-white">
              AI Tutor
            </h2>
            <p className="text-white/60 text-center max-w-md mb-8">
              Start a new conversation to learn about any topic. Ask questions
              and get clear, easy-to-understand explanations.
            </p>

            {/* Suggestion chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
              {[
                "Explain quantum computing simply",
                "How does photosynthesis work?",
                "Teach me about neural networks",
                "What is the theory of relativity?",
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(suggestion)}
                  disabled={isCreatingSession}
                  className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-left transition-all hover:shadow-lg shadow-indigo-500/10 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageSquareText className="w-4 h-4 text-indigo-400 flex-shrink-0 group-hover:text-indigo-300 transition-colors" />
                  <span className="truncate text-white/80 group-hover:text-white transition-colors">{suggestion}</span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            <AnimatePresence>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md rounded-b-3xl">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading || isCreatingSession}
          />
        </div>
      </div>

      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="sm:max-w-md bg-[#0f1123] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              Connection Failed
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-base py-2 text-white/70">
            {errorMessage}
          </DialogDescription>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </main>
  );
}
