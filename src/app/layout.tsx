import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Learnix",
    default: "Learnix Dashboard - AI Tutor & Quiz System",
  },
  description: "Interactive AI Tutor and Quiz Dashboard. Enhance your learning experience with Learnix.",
  keywords: ["AI Tutor", "Learning Dashboard", "Learnix", "Quiz System", "Education", "Next.js"],
  authors: [{ name: "Learnix Team" }],
  openGraph: {
    title: "Learnix Dashboard",
    description: "Interactive AI Tutor and Quiz Dashboard.",
    url: "https://learnix.app",
    siteName: "Learnix",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learnix Dashboard",
    description: "Interactive AI Tutor and Quiz Dashboard.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
