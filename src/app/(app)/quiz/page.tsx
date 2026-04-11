"use client";

import { useState, useEffect } from "react";
import { Brain, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Quiz } from "@/types/quiz";
import { QuizCard } from "@/components/quiz/quiz-card";
import { QuizResults } from "@/components/quiz/quiz-results";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp, scaleIn } from "@/components/motion/variants";

type QuizState = "idle" | "generating" | "active" | "results";

export default function QuizPage() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [quizState, setQuizState] = useState<QuizState>("idle");
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setUserId(user.id);
      } catch {
        console.warn("Failed to parse user from localStorage");
      }
    }
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setQuizState("generating");
    setGenerateError(null);
    
    try {
      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, numQuestions, userId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      setQuiz(data.quiz);
      setQuizState("active");
      setUserAnswers({});
      setCurrentQuestionIdx(0);
    } catch (error: any) {
      console.error("Failed to generate quiz", error);
      setGenerateError(error.message || "Failed to generate quiz. Please try again.");
      setQuizState("idle");
    }
  };

  const handleSelectOption = (option: string) => {
    setUserAnswers((prev) => ({ ...prev, [currentQuestionIdx]: option }));
  };

  const handleNext = () => {
    if (!quiz) return;
    if (currentQuestionIdx < quiz.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      // Calculate score and show results
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    if (!quiz || isSubmitting) return;
    
    setIsSubmitting(true);
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) score++;
    });

    try {
      await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId || "anonymous",
          topic: quiz.topic,
          score,
          questions: quiz.questions
        })
      });
    } catch (e) {
      console.warn("Could not save to DB", e);
    } finally {
      setIsSubmitting(false);
      setQuizState("results");
    }
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) score++;
    });
    return score;
  };

  return (
    <motion.main 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="min-h-[calc(100vh-10rem)] flex flex-col"
    >
      {quizState === "idle" && (
        <motion.div variants={fadeUp} className="max-w-2xl mx-auto w-full mt-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5 shadow-lg shadow-purple-500/10">
              <Brain size={32} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Generate a Practice Quiz</h1>
            <p className="text-white/60">Pick any topic and let AI create a custom test for you.</p>
          </div>

          {/* Error message */}
          {generateError && (
            <motion.div variants={scaleIn} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <p className="font-medium mb-1">Failed to generate quiz</p>
              <p className="opacity-80">{generateError}</p>
            </motion.div>
          )}

          <Card className="border-white/10 shadow-xl shadow-indigo-500/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">What do you want to learn about?</label>
                  <Input 
                    placeholder="e.g. Photosynthesis, World War 2, Next.js Routing..." 
                    className="h-14 px-4 rounded-xl text-lg bg-white/5 text-white border-white/10 focus-visible:ring-indigo-400/40 focus-visible:border-indigo-400/50 placeholder:text-white/30 transition-all"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-white/80">Difficulty</label>
                     <select 
                       className="flex h-12 w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400/50 transition-all appearance-none [&>option]:bg-[#090a1f]"
                       value={difficulty}
                       onChange={(e) => setDifficulty(e.target.value as any)}
                     >
                       <option value="easy">Easy</option>
                       <option value="medium">Medium</option>
                       <option value="hard">Hard</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-white/80">Questions</label>
                     <select 
                       className="flex h-12 w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400/50 transition-all appearance-none [&>option]:bg-[#090a1f]"
                       value={numQuestions}
                       onChange={(e) => setNumQuestions(Number(e.target.value))}
                     >
                       <option value={3}>3 Questions</option>
                       <option value={5}>5 Questions</option>
                       <option value={10}>10 Questions</option>
                     </select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-xl text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white mt-4 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all duration-300 border-0"
                  disabled={!topic.trim()}
                >
                  Generate Quiz
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {quizState === "generating" && (
        <motion.div variants={fadeUp} className="flex-1 flex flex-col items-center justify-center space-y-6">
          <Loader2 className="w-16 h-16 animate-spin text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Creating your quiz...</h2>
          <p className="text-white/60">Analyzing the topic and generating challenging questions.</p>
        </motion.div>
      )}

      {quizState === "active" && quiz && (
        <motion.div variants={scaleIn} className="flex-1 flex flex-col items-center justify-center mt-10 w-full relative z-10">
          <QuizCard
            question={quiz.questions[currentQuestionIdx]}
            currentNumber={currentQuestionIdx + 1}
            totalQuestions={quiz.questions.length}
            selectedOption={userAnswers[currentQuestionIdx] || null}
            onSelectOption={handleSelectOption}
          />
          <div className="mt-8 flex justify-end w-full max-w-2xl px-2">
            <Button 
              size="lg" 
              className="px-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-[1.05] text-white font-medium shadow-lg shadow-indigo-500/20 transition-all border-0"
              onClick={handleNext}
              disabled={!userAnswers[currentQuestionIdx] || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                currentQuestionIdx < quiz.questions.length - 1 ? "Next Question" : "Finish Quiz"
              )}
            </Button>
          </div>
        </motion.div>
      )}

      {quizState === "results" && quiz && (
        <motion.div variants={fadeUp} className="flex-1 w-full">
          <QuizResults
            questions={quiz.questions}
            userAnswers={userAnswers}
            score={calculateScore()}
            onRetry={() => {
              setQuizState("active");
              setUserAnswers({});
              setCurrentQuestionIdx(0);
            }}
            onNewQuiz={() => {
              setQuizState("idle");
              setTopic("");
              setGenerateError(null);
            }}
          />
        </motion.div>
      )}
    </motion.main>
  );
}
