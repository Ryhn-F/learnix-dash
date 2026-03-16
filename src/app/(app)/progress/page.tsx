"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProgress } from "@/types/user";

export default function ProgressPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/progress?userId=mock-user")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProgress(data.progress);
        }
      })
      .catch((e) => console.error("Failed to load progress:", e))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex animate-pulse flex-col space-y-6">
        <div className="h-8 w-1/4 bg-muted rounded-md mb-8"></div>
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-2xl"></div>
          ))}
        </div>
        <div className="h-64 bg-muted rounded-2xl mt-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Learning Progress
        </h1>
        <p className="text-muted-foreground">
          Track your performance over time.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-2xl border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quizzes Attempted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {progress?.totalAttempts || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-amber-500">
              {progress?.averageScore || 0}%
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recent Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              {progress?.recentTopics.length
                ? progress.recentTopics.join(", ")
                : "No topics yet"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 pt-6">
        <h2 className="text-2xl font-bold">Quiz History</h2>

        <div className="border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Topic</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Questions</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {progress?.history && progress.history.length > 0 ? (
                progress.history.map((record, i) => (
                  <tr
                    key={i}
                    className="border-t hover:bg-muted/50 transition-colors bg-card"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {record.topic}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold">{record.score}</span> /{" "}
                      {record.total_questions}
                    </td>
                    <td className="px-6 py-4">{record.total_questions}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(record.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-card">
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No quizzes found. Go practice to see your history!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
