"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, Trophy, MessageSquare, Loader2, FileQuestion } from "lucide-react";
import Link from "next/link";

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
    <main className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          {greeting()},{" "}
          {isLoading ? (
            <Skeleton className="inline-block w-32 h-8 align-middle rounded-lg" />
          ) : (
            <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-500 to-indigo-500">
              {user?.name || "Guest"}
            </span>
          )}
          !
        </h1>
        <p className="text-muted-foreground text-lg">
          Ready to learn something new today?
        </p>
      </div>

      {/* Stats Cards — 3 columns (no streak) */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Topics Mastered */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Topics Covered
            </CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="w-12 h-8 rounded" />
            ) : (
              <div className="text-3xl font-bold">
                {progress?.recentTopics?.length ?? 0}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Average Score */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Score
            </CardTitle>
            <Trophy className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="w-16 h-8 rounded" />
            ) : (
              <div className="text-3xl font-bold">
                {progress?.totalAttempts
                  ? `${progress.averageScore}%`
                  : "—"}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tutor Sessions */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tutor Sessions
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="w-8 h-8 rounded" />
            ) : (
              <div className="text-3xl font-bold">{chatCount}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Quick Actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/tutor">
              <div className="p-6 rounded-2xl bg-card border shadow-sm hover:border-purple-500 hover:shadow-md transition-all group flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare size={32} />
                </div>
                <div>
                  <h3 className="font-semibold">Ask AI Tutor</h3>
                  <p className="text-sm text-muted-foreground">
                    Explain a concept
                  </p>
                </div>
              </div>
            </Link>
            <Link href="/quiz">
              <div className="p-6 rounded-2xl bg-card border shadow-sm hover:border-purple-500 hover:shadow-md transition-all group flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Brain size={32} />
                </div>
                <div>
                  <h3 className="font-semibold">Practice Quiz</h3>
                  <p className="text-sm text-muted-foreground">
                    Test your knowledge
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity — real quiz attempts */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Recent Activity
          </h2>
          <Card className="rounded-2xl shadow-sm border">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : !progress?.history?.length ? (
                <div className="p-8 text-center">
                  <FileQuestion className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No activity yet
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Take a quiz to see your history here!
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {progress.history.slice(0, 5).map((attempt) => (
                    <div
                      key={attempt.id}
                      className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                        <div>
                          <p className="font-medium text-sm">
                            {attempt.topic} Quiz
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatRelativeTime(attempt.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="font-bold text-sm bg-muted px-2.5 py-1 rounded-md shrink-0">
                        {attempt.score}/{attempt.total_questions}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
