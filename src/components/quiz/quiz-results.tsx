import { QuizQuestion } from "@/types/quiz";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizResultsProps {
  questions: QuizQuestion[];
  userAnswers: Record<number, string>;
  score: number;
  onRetry: () => void;
  onNewQuiz: () => void;
}

export function QuizResults({ questions, userAnswers, score, onRetry, onNewQuiz }: QuizResultsProps) {
  const isGood = score >= questions.length * 0.7;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 mt-10">
      <div className="text-center space-y-4 p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl shadow-indigo-500/10">
        <h2 className="text-3xl font-bold text-white">Quiz Complete!</h2>
        <div className={`text-5xl font-extrabold ${isGood ? "text-emerald-400" : "text-amber-400"}`}>
          {score} / {questions.length}
        </div>
        <p className="text-white/60">
          {isGood ? "Great job! You really understand this topic." : "Keep practicing! Review the explanations below."}
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button
            variant="outline"
            onClick={onRetry}
            className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
          >
            Try Again
          </Button>
          <Button
            onClick={onNewQuiz}
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-500/25"
          >
            New Topic
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">Review Answers</h3>
        {questions.map((q, idx) => {
          const userAnswer = userAnswers[idx];
          const isCorrect = userAnswer === q.answer;

          return (
            <div key={idx} className={`p-6 rounded-xl backdrop-blur-md border ${isCorrect ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"}`}>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {isCorrect ? (
                    <CheckCircle2 className="text-emerald-400 w-6 h-6" />
                  ) : (
                    <XCircle className="text-red-400 w-6 h-6" />
                  )}
                </div>
                <div className="space-y-3 flex-1">
                  <p className="font-medium text-lg leading-snug text-white">{q.question}</p>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-white/80">
                      <span className="font-bold">Your answer: </span>
                      <span className={isCorrect ? "text-emerald-400" : "text-red-400"}>
                        {userAnswer || "No answer"}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-white/80">
                        <span className="font-bold">Correct answer: </span>
                        <span className="text-emerald-400">{q.answer}</span>
                      </p>
                    )}
                  </div>

                  <div className="bg-white/5 p-4 rounded-lg text-sm border border-white/10 mt-4 text-white/70">
                    <span className="font-bold block mb-1 text-white/90">Explanation:</span>
                    {q.explanation}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

