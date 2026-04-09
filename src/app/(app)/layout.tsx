import { AppLayout } from "@/components/layout/app-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Learnix Dashboard - Your AI-powered learning environment.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
