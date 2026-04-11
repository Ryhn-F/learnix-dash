"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UserProgress } from "@/types/user";
import {
  FileQuestion,
  Trophy,
  Brain,
  TrendingUp,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/components/motion/variants";

export default function ProgressPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      setIsLoading(false);
      return;
    }

    try {
      const user = JSON.parse(stored);
      fetch(`/api/progress?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProgress(data.progress);
          }
        })
        .catch((e) => console.error("Failed to load progress:", e))
        .finally(() => setIsLoading(false));
    } catch {
      setIsLoading(false);
    }
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreColor = (score: number, total: number) => {
    const pct = (score / total) * 100;
    if (pct >= 80) return "text-emerald-400";
    if (pct >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBadgeBg = (score: number, total: number) => {
    const pct = (score / total) * 100;
    if (pct >= 80)
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.2)]";
    if (pct >= 60)
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(251,191,36,0.2)]";
    return "bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(248,113,113,0.2)]";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          <p className="text-sm text-white/50">Loading progress...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.main 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">
          Learning Progress
        </h1>
        <p className="text-white/60">
          Track your quiz performance and improvement over time.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={fadeUp} className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-2xl shadow-lg shadow-indigo-500/10 backdrop-blur-md bg-white/5 border-white/10 hover:scale-[1.02] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">
              Quizzes Attempted
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
              <FileQuestion className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">
              {progress?.totalAttempts || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg shadow-amber-500/10 backdrop-blur-md bg-white/5 border-white/10 hover:scale-[1.02] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">
              Average Score
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Trophy className="h-4 w-4 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span
                className={`text-4xl font-bold ${
                  progress?.totalAttempts
                    ? progress.averageScore >= 80
                      ? "text-emerald-400"
                      : progress.averageScore >= 60
                        ? "text-amber-400"
                        : "text-red-400"
                    : "text-white"
                }`}
              >
                {progress?.totalAttempts ? `${progress.averageScore}%` : "—"}
              </span>
              {progress?.totalAttempts ? (
                <div className="mb-1.5 flex-1 max-w-[100px]">
                  <Progress
                    value={progress.averageScore}
                    className="h-2 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:to-purple-500"
                  />
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg shadow-blue-500/10 backdrop-blur-md bg-white/5 border-white/10 hover:scale-[1.02] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">
              Topics Explored
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <Brain className="h-4 w-4 text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent>
            {progress?.recentTopics?.length ? (
              <div className="flex flex-wrap gap-2">
                {progress.recentTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold shadow-[0_0_10px_rgba(99,102,241,0.15)]"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/50">No topics yet</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quiz History */}
      <motion.div variants={fadeUp} className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shadow-lg shadow-indigo-500/10">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Quiz History</h2>
          </div>
          {progress?.history && progress.history.length > 0 && (
            <span className="text-sm px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/70 shadow-sm">
              {progress.history.length} attempt
              {progress.history.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {progress?.history && progress.history.length > 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl shadow-indigo-500/5 overflow-hidden">
            {/* Desktop Table */}
            <table className="w-full text-sm text-left hidden md:table">
              <thead className="bg-white/5 text-white/50 uppercase text-[10px] tracking-wider font-bold border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-semibold">Topic</th>
                  <th className="px-6 py-4 font-semibold">Score</th>
                  <th className="px-6 py-4 font-semibold">Accuracy</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                </tr>
              </thead>
              <motion.tbody variants={staggerContainer} initial="hidden" animate="visible" className="divide-y divide-white/5">
                {progress.history.map((record) => {
                  const pct = Math.round(
                    (record.score / record.total_questions) * 100
                  );
                  return (
                    <motion.tr
                      variants={fadeUp}
                      key={record.id}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4 font-medium text-white/90 group-hover:text-white transition-colors">
                        {record.topic}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-bold ${getScoreColor(record.score, record.total_questions)}`}
                        >
                          {record.score}
                        </span>
                        <span className="text-white/40 font-medium">
                          {" "}
                          / {record.total_questions}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${getScoreBadgeBg(record.score, record.total_questions)}`}
                        >
                          {pct}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/40 text-xs font-medium">
                        {formatDate(record.created_at)}
                      </td>
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            </table>

            {/* Mobile Cards */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="md:hidden divide-y divide-white/5">
              {progress.history.map((record) => {
                const pct = Math.round(
                  (record.score / record.total_questions) * 100
                );
                return (
                  <motion.div
                    variants={fadeUp}
                    key={record.id}
                    className="p-5 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-white/90">{record.topic}</span>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${getScoreBadgeBg(record.score, record.total_questions)}`}
                      >
                        {pct}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-white/50 font-medium">
                      <span>
                        Score:{" "}
                        <span
                          className={`font-bold ml-1 ${getScoreColor(record.score, record.total_questions)}`}
                        >
                          {record.score}/{record.total_questions}
                        </span>
                      </span>
                      <span className="text-xs">
                        {formatDate(record.created_at)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        ) : (
          /* Empty State */
          <Card className="rounded-2xl border-white/10 bg-white/5 backdrop-blur-md shadow-xl shadow-indigo-500/5">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <FileQuestion className="w-8 h-8 text-white/20" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                No quiz attempts yet
              </h3>
              <p className="text-white/50 mb-8 text-center max-w-md">
                Take your first quiz to start tracking your learning progress
                and see your scores here.
              </p>
              <Link href="/quiz">
                <Button className="h-12 px-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-[1.05] shadow-lg shadow-indigo-500/25 border-0 text-white font-semibold transition-all">
                  Take a Quiz
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </motion.main>
  );
}
