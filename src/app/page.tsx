import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageSquare, Target } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />

      <main className="z-10 text-center px-4 max-w-4xl pt-20 pb-32">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-medium text-sm mb-8">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Personalized Learning Platform</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          Master any topic with <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-indigo-600">
            Learnix AI
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Struggling with a concept? Want to test your knowledge? Learnix adapts to your learning style with interactive tutoring and dynamic quizzes.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="h-14 px-8 text-lg font-medium rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              Get Started for Free
            </Button>
          </Link>
          <Link href="https://github.com/learnix" target="_blank">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-medium rounded-2xl">
              View Source
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-24">
          {[
            {
              icon: MessageSquare,
              title: "AI Tutor",
              desc: "Ask questions and get clear, easy-to-understand explanations with examples.",
            },
            {
              icon: Target,
              title: "Dynamic Quizzes",
              desc: "Instantly generate practice quizzes on any topic to test your knowledge.",
            },
            {
              icon: Sparkles,
              title: "Progress Tracking",
              desc: "Watch yourself improve with detailed statistics and history tracking.",
            },
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-3xl bg-card border shadow-sm text-left hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-300 mb-6">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
