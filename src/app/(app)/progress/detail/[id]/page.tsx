"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  Trophy,
  Target,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp, scaleIn } from "@/components/motion/variants";

interface QuizDetailQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  user_answer: string | null;
}

interface QuizDetailData {
  id: string;
  topic: string;
  score: number;
  total_questions: number;
  created_at: string;
  questions: QuizDetailQuestion[];
}

export default function ProgressDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const [attempt, setAttempt] = useState<QuizDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId) return;

    fetch(`/api/quiz/${quizId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAttempt(data.attempt);
        } else {
          setError(data.error || "Failed to load quiz details");
        }
      })
      .catch((e) => {
        console.error("Failed to load quiz detail:", e);
        setError("Failed to load quiz details");
      })
      .finally(() => setIsLoading(false));
  }, [quizId]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          <p className="text-sm text-white/50">Loading quiz details...</p>
        </div>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Quiz Not Found</h2>
          <p className="text-white/50 max-w-md">
            {error || "The quiz attempt you're looking for doesn't exist or has been removed."}
          </p>
          <Link href="/progress">
            <Button className="mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-[1.05] shadow-lg shadow-indigo-500/25 border-0 text-white font-semibold transition-all">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Progress
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const pct = Math.round((attempt.score / attempt.total_questions) * 100);
  const isGood = pct >= 70;
  const hasUserAnswers = attempt.questions.some((q) => q.user_answer !== null);
  const correctCount = attempt.questions.filter(
    (q) => q.user_answer != null && q.user_answer === q.answer
  ).length;
  const incorrectCount = hasUserAnswers
    ? attempt.questions.filter(
        (q) => q.user_answer != null && q.user_answer !== q.answer
      ).length
    : attempt.total_questions - attempt.score;

  return (
    <motion.main
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12"
    >
      {/* Back Button & Header */}
      <motion.div variants={fadeUp} className="space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Progress
        </button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            {attempt.topic}
          </h1>
          <p className="text-white/50 flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            {formatDate(attempt.created_at)}
          </p>
        </div>
      </motion.div>

      {/* Score Summary Card */}
      <motion.div
        variants={scaleIn}
        className="text-center space-y-5 p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl shadow-indigo-500/10"
      >
        <h2 className="text-xl font-semibold text-white/80">Quiz Result</h2>
        <div
          className={`text-6xl font-extrabold ${isGood ? "text-emerald-400" : "text-amber-400"}`}
        >
          {attempt.score} / {attempt.total_questions}
        </div>
        <div className="flex items-center justify-center gap-2">
          <span
            className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold ${
              pct >= 80
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.2)]"
                : pct >= 60
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                  : "bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(248,113,113,0.2)]"
            }`}
          >
            {pct}% Accuracy
          </span>
        </div>
        <p className="text-white/60 text-sm">
          {isGood
            ? "Great job! You demonstrated strong knowledge on this topic."
            : "Keep practicing! Review the explanations below to improve."}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto pt-2">
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-lg font-bold text-emerald-400">
              {correctCount}
            </span>
            <span className="text-[11px] text-white/40 font-medium uppercase tracking-wider">
              Correct
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
            <XCircle className="w-5 h-5 text-red-400" />
            <span className="text-lg font-bold text-red-400">
              {incorrectCount}
            </span>
            <span className="text-[11px] text-white/40 font-medium uppercase tracking-wider">
              Incorrect
            </span>
          </div>
        </div>
      </motion.div>

      {/* Legacy results banner */}
      {!hasUserAnswers && (
        <motion.div
          variants={fadeUp}
          className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 text-amber-300/80 text-sm"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
          <div>
            <p className="font-semibold text-amber-300">Older quiz result</p>
            <p className="text-amber-300/60 mt-0.5">
              Individual answer choices were not recorded for this attempt. Only the correct answers and explanations are shown.
            </p>
          </div>
        </motion.div>
      )}

      {/* Questions Review */}
      <motion.div variants={fadeUp} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shadow-lg shadow-indigo-500/10">
            <Target className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">Review Answers</h3>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {attempt.questions.map((q, idx) => {
            const userAnswer = q.user_answer;
            const isCorrect = userAnswer === q.answer;

            return (
              <motion.div
                variants={fadeUp}
                key={idx}
                className={`p-6 rounded-2xl backdrop-blur-md border transition-all ${
                  userAnswer == null
                    ? "bg-white/[0.02] border-white/10 hover:border-white/20"
                    : isCorrect
                      ? "bg-emerald-500/5 border-emerald-500/15 hover:border-emerald-500/30"
                      : "bg-red-500/5 border-red-500/15 hover:border-red-500/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {userAnswer == null ? (
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <AlertCircle className="text-white/30 w-5 h-5" />
                      </div>
                    ) : isCorrect ? (
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle2 className="text-emerald-400 w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                        <XCircle className="text-red-400 w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-4 flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium text-lg leading-snug text-white">
                        <span className="text-white/40 font-bold mr-2 text-sm">
                          Q{idx + 1}.
                        </span>
                        {q.question}
                      </p>
                    </div>

                    {/* Options List */}
                    <div className="space-y-2">
                      {q.options.map((option, optIdx) => {
                        const isUserChoice = option === userAnswer;
                        const isCorrectAnswer = option === q.answer;

                        let optionStyle =
                          "bg-white/[0.02] border-white/5 text-white/60";
                        if (isCorrectAnswer) {
                          optionStyle =
                            "bg-emerald-500/10 border-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/20";
                        } else if (isUserChoice && !isCorrect) {
                          optionStyle =
                            "bg-red-500/10 border-red-500/20 text-red-300 ring-1 ring-red-500/20 line-through decoration-red-400/40";
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all ${optionStyle}`}
                          >
                            <span className="shrink-0 w-6 h-6 rounded-full border border-current/20 flex items-center justify-center text-xs font-bold opacity-60">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1">{option}</span>
                            {isCorrectAnswer && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                            {isUserChoice && !isCorrect && (
                              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Answer Info */}
                    <div className="space-y-1 text-sm">
                      <p className="text-white/70">
                        <span className="font-semibold">Your answer: </span>
                        {userAnswer == null ? (
                          <span className="text-white/30 italic">Not recorded</span>
                        ) : (
                          <span
                            className={
                              isCorrect ? "text-emerald-400" : "text-red-400"
                            }
                          >
                            {userAnswer}
                          </span>
                        )}
                      </p>
                      {userAnswer != null && !isCorrect && (
                        <p className="text-white/70">
                          <span className="font-semibold">
                            Correct answer:{" "}
                          </span>
                          <span className="text-emerald-400">{q.answer}</span>
                        </p>
                      )}
                    </div>

                    {/* Explanation */}
                    <div className="bg-white/5 p-4 rounded-xl text-sm border border-white/10 text-white/70">
                      <span className="font-bold block mb-1 text-white/90">
                        Explanation:
                      </span>
                      {q.explanation}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Bottom Actions */}
      <motion.div variants={fadeUp} className="flex justify-center gap-4 pt-4">
        <Link href="/progress">
          <Button
            variant="outline"
            className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white px-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Progress
          </Button>
        </Link>
        <Link href="/quiz">
          <Button className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-500/25 px-6">
            <Trophy className="w-4 h-4 mr-2" />
            Take New Quiz
          </Button>
        </Link>
      </motion.div>
    </motion.main>
  );
}
