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
    if (pct >= 80) return "text-green-600 dark:text-green-400";
    if (pct >= 60) return "text-amber-500 dark:text-amber-400";
    return "text-red-500 dark:text-red-400";
  };

  const getScoreBadgeBg = (score: number, total: number) => {
    const pct = (score / total) * 100;
    if (pct >= 80)
      return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
    if (pct >= 60)
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300";
    return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <p className="text-sm text-muted-foreground">Loading progress...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Learning Progress
        </h1>
        <p className="text-muted-foreground">
          Track your quiz performance and improvement over time.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quizzes Attempted
            </CardTitle>
            <FileQuestion className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {progress?.totalAttempts || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Score
            </CardTitle>
            <Trophy className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span
                className={`text-4xl font-bold ${
                  progress?.totalAttempts
                    ? progress.averageScore >= 80
                      ? "text-green-600 dark:text-green-400"
                      : progress.averageScore >= 60
                        ? "text-amber-500"
                        : "text-red-500"
                    : ""
                }`}
              >
                {progress?.totalAttempts ? `${progress.averageScore}%` : "—"}
              </span>
              {progress?.totalAttempts ? (
                <div className="mb-1.5">
                  <Progress
                    value={progress.averageScore}
                    className="w-20 h-2"
                  />
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Topics Explored
            </CardTitle>
            <Brain className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            {progress?.recentTopics?.length ? (
              <div className="flex flex-wrap gap-1.5">
                {progress.recentTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No topics yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quiz History */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <h2 className="text-2xl font-bold">Quiz History</h2>
          </div>
          {progress?.history && progress.history.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {progress.history.length} attempt
              {progress.history.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {progress?.history && progress.history.length > 0 ? (
          <div className="border rounded-2xl overflow-hidden shadow-sm">
            {/* Desktop Table */}
            <table className="w-full text-sm text-left hidden md:table">
              <thead className="bg-muted text-muted-foreground uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Topic</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Percentage</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {progress.history.map((record) => {
                  const pct = Math.round(
                    (record.score / record.total_questions) * 100
                  );
                  return (
                    <tr
                      key={record.id}
                      className="border-t hover:bg-muted/50 transition-colors bg-card"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">
                        {record.topic}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-bold ${getScoreColor(record.score, record.total_questions)}`}
                        >
                          {record.score}
                        </span>
                        <span className="text-muted-foreground">
                          {" "}
                          / {record.total_questions}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${getScoreBadgeBg(record.score, record.total_questions)}`}
                        >
                          {pct}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        {formatDate(record.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y">
              {progress.history.map((record) => {
                const pct = Math.round(
                  (record.score / record.total_questions) * 100
                );
                return (
                  <div
                    key={record.id}
                    className="p-4 bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{record.topic}</span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${getScoreBadgeBg(record.score, record.total_questions)}`}
                      >
                        {pct}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        Score:{" "}
                        <span
                          className={`font-bold ${getScoreColor(record.score, record.total_questions)}`}
                        >
                          {record.score}/{record.total_questions}
                        </span>
                      </span>
                      <span className="text-xs">
                        {formatDate(record.created_at)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Empty State */
          <Card className="rounded-2xl border shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileQuestion className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold mb-1">
                No quiz attempts yet
              </h3>
              <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
                Take your first quiz to start tracking your learning progress
                and see your scores here.
              </p>
              <Link href="/quiz">
                <Button className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white">
                  Take a Quiz
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
