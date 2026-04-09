import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your Learnix learning progress, recent activity, and start new AI tutor sessions or quizzes.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
