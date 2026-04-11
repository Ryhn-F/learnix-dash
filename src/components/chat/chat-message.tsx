import { ChatMessage as IChatMessage } from "@/types/chat";
import { User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { fadeUp } from "@/components/motion/variants";

export function ChatMessage({ message }: { message: IChatMessage }) {
  const isUser = message.role === "user";

  return (
    <motion.div 
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={`flex w-full gap-4 p-5 rounded-3xl backdrop-blur-md border border-white/10 ${
        isUser ? "bg-white/5 ml-auto md:max-w-[85%]" : "bg-indigo-500/10 mr-auto md:max-w-[85%]"
      }`}
    >
      <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border border-white/10 hidden sm:flex ${
        isUser ? "bg-white/10 text-white" : "bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-purple-500/20"
      }`}>
        {isUser ? <User size={16} /> : <Sparkles size={16} />}
      </div>
      <div className="flex-1 space-y-2 overflow-hidden text-white/90">
        <div className="font-semibold text-sm text-white/80">
          {isUser ? "You" : "Learnix AI"}
        </div>
        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-white/90 prose-p:leading-relaxed prose-pre:bg-white/5 prose-pre:border-white/10">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
