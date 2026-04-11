"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, Trophy, MessageSquare, Loader2, FileQuestion } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/components/motion/variants";

interface QuizAttemptRecord {
  id: string;
  topic: string;
  score: number;
  total_questions: number;
  created_at: string;
}

interface ProgressData {
  totalAttempts: number;
  averageScore: number;
  recentTopics: string[];
  history: QuizAttemptRecord[];
}

interface UserData {
  id: string;
  name: string;
  email: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [chatCount, setChatCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      setIsLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as UserData;
      setUser(parsed);
      fetchDashboardData(parsed.id);
    } catch {
      setIsLoading(false);
    }
  }, []);

  const fetchDashboardData = async (userId: string) => {
    try {
      const [progressRes, sessionsRes] = await Promise.all([
        fetch(`/api/progress?userId=${userId}`),
        fetch(`/api/sessions?userId=${userId}`),
      ]);

      const progressData = await progressRes.json();
      if (progressRes.ok && progressData.progress) {
        setProgress(progressData.progress);
      }

      const sessionsData = await sessionsRes.json();
      if (sessionsRes.ok && sessionsData.data) {
        setChatCount(sessionsData.data.length);
      }
    } catch (e) {
      console.error("Failed to fetch dashboard data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.main 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          {greeting()},{" "}
          {isLoading ? (
            <Skeleton className="inline-block w-32 h-8 align-middle rounded-lg bg-white/10" />
          ) : (
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">
              {user?.name?.split(" ")[0] || "Guest"}
            </span>
          )}
          !
        </h1>
        <p className="text-white/60 text-lg">
          Ready to learn something new today?
        </p>
      </motion.div>

      {/* Stats Cards — 3 columns */}
      <motion.div variants={fadeUp} className="grid gap-6 md:grid-cols-3">
        {/* Topics Mastered */}
        <Card className="rounded-2xl shadow-lg shadow-indigo-500/10 backdrop-blur-md bg-white/5 border-white/10 hover:scale-[1.02] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">
              Topics Covered
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Brain className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="w-12 h-8 rounded bg-white/10" />
            ) : (
              <div className="text-3xl font-bold text-white">
                {progress?.recentTopics?.length ?? 0}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Average Score */}
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
            {isLoading ? (
              <Skeleton className="w-16 h-8 rounded bg-white/10" />
            ) : (
              <div className="text-3xl font-bold text-white">
                {progress?.totalAttempts
                  ? `${progress.averageScore}%`
                  : "—"}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tutor Sessions */}
        <Card className="rounded-2xl shadow-lg shadow-blue-500/10 backdrop-blur-md bg-white/5 border-white/10 hover:scale-[1.02] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">
              Tutor Sessions
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="w-8 h-8 rounded bg-white/10" />
            ) : (
              <div className="text-3xl font-bold text-white">{chatCount}</div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <motion.div variants={fadeUp} className="space-y-4 flex flex-col">
          <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">
            Quick Actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 flex-1">
            <Link href="/tutor" className="h-full">
              <div className="h-full p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg shadow-indigo-500/10 hover:border-indigo-500/50 hover:shadow-indigo-500/20 hover:scale-[1.02] transition-all duration-300 group flex flex-col items-center text-center gap-4 justify-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/5">
                  <MessageSquare size={32} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Ask AI Tutor</h3>
                  <p className="text-sm text-white/60 mt-1">
                    Explain a concept
                  </p>
                </div>
              </div>
            </Link>
            <Link href="/quiz" className="h-full">
              <div className="h-full p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg shadow-purple-500/10 hover:border-purple-500/50 hover:shadow-purple-500/20 hover:scale-[1.02] transition-all duration-300 group flex flex-col items-center text-center gap-4 justify-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/5">
                  <Brain size={32} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Practice Quiz</h3>
                  <p className="text-sm text-white/60 mt-1">
                    Test your knowledge
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeUp} className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">
            Recent Activity
          </h2>
          <Card className="rounded-2xl shadow-lg shadow-indigo-500/5 backdrop-blur-md bg-white/5 border-white/10 h-[calc(100%-3rem)] flex flex-col">
            <CardContent className="p-0 flex-1 flex flex-col">
              {isLoading ? (
                <div className="p-6 flex items-center justify-center flex-1">
                  <Loader2 className="w-6 h-6 animate-spin text-white/40" />
                </div>
              ) : !progress?.history?.length ? (
                <div className="p-8 flex flex-col items-center justify-center text-center flex-1">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <FileQuestion className="w-8 h-8 text-white/20" />
                  </div>
                  <p className="text-sm text-white/60 font-medium">
                    No activity yet
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    Take a quiz to see your history here!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/5 flex-1 p-2">
                  {progress.history.slice(0, 5).map((attempt) => (
                    <div
                      key={attempt.id}
                      className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] shrink-0" />
                        <div>
                          <p className="font-medium text-sm text-white">
                            {attempt.topic}
                          </p>
                          <p className="text-xs text-white/50 mt-0.5">
                            {formatRelativeTime(attempt.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="font-bold text-sm bg-white/10 px-3 py-1.5 rounded-lg shrink-0 text-white border border-white/5">
                        {attempt.score}/{attempt.total_questions}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.main>
  );
}
