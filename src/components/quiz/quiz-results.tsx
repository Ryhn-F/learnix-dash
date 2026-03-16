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
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4 p-8 bg-card rounded-2xl border">
        <h2 className="text-3xl font-bold">Quiz Complete!</h2>
        <div className={`text-5xl font-extrabold ${isGood ? "text-green-500" : "text-amber-500"}`}>
          {score} / {questions.length}
        </div>
        <p className="text-muted-foreground">
          {isGood ? "Great job! You really understand this topic." : "Keep practicing! Review the explanations below."}
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button variant="outline" onClick={onRetry}>Try Again</Button>
          <Button onClick={onNewQuiz}>New Topic</Button>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold">Review Answers</h3>
        {questions.map((q, idx) => {
          const userAnswer = userAnswers[idx];
          const isCorrect = userAnswer === q.answer;

          return (
            <div key={idx} className={`p-6 rounded-xl border ${isCorrect ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"}`}>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {isCorrect ? (
                    <CheckCircle2 className="text-green-500 w-6 h-6" />
                  ) : (
                    <XCircle className="text-red-500 w-6 h-6" />
                  )}
                </div>
                <div className="space-y-3 flex-1">
                  <p className="font-medium text-lg leading-snug">{q.question}</p>
                  
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-bold">Your answer: </span>
                      <span className={isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                        {userAnswer || "No answer"}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-sm">
                        <span className="font-bold">Correct answer: </span>
                        <span className="text-green-600 dark:text-green-400">{q.answer}</span>
                      </p>
                    )}
                  </div>

                  <div className="bg-background/50 p-4 rounded-lg text-sm border mt-4">
                    <span className="font-bold block mb-1">Explanation:</span>
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
