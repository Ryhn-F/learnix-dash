"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Trophy, Activity, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome back!</h1>
        <p className="text-muted-foreground text-lg">Ready to learn something new today?</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-none shadow-md bg-linear-to-br from-purple-500 to-indigo-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Study Streak</CardTitle>
            <Activity className="h-4 w-4 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3 Days</div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Topics Mastered</CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
            <Trophy className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">85%</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tutor Sessions</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/tutor">
              <div className="p-6 rounded-2xl bg-card border shadow-sm hover:border-purple-500 hover:shadow-md transition-all group flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare size={32} />
                </div>
                <div>
                  <h3 className="font-semibold">Ask AI Tutor</h3>
                  <p className="text-sm text-muted-foreground">Explain a concept</p>
                </div>
              </div>
            </Link>
            <Link href="/quiz">
              <div className="p-6 rounded-2xl bg-card border shadow-sm hover:border-purple-500 hover:shadow-md transition-all group flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Brain size={32} />
                </div>
                <div>
                  <h3 className="font-semibold">Practice Quiz</h3>
                  <p className="text-sm text-muted-foreground">Test your knowledge</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Activity</h2>
          <Card className="rounded-2xl shadow-sm border">
            <CardContent className="p-0">
              <div className="divide-y">
                {[
                  { title: "Photosynthesis Quiz", time: "2 hours ago", score: "9/10" },
                  { title: "Tutor: Quantum Physics", time: "1 day ago", score: null },
                  { title: "World War II Quiz", time: "2 days ago", score: "7/10" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                    {item.score && (
                      <div className="font-bold text-sm bg-muted px-2 py-1 rounded-md">
                        {item.score}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
