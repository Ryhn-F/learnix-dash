import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Quiz",
  description: "Generate and take AI-powered quizzes on any topic to test and improve your knowledge.",
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
