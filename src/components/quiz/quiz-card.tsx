import { QuizQuestion } from "@/types/quiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuizCardProps {
  question: QuizQuestion;
  currentNumber: number;
  totalQuestions: number;
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
}

export function QuizCard({
  question,
  currentNumber,
  totalQuestions,
  selectedOption,
  onSelectOption,
}: QuizCardProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto border-white/10 bg-white/5 backdrop-blur-md shadow-xl shadow-indigo-500/10 rounded-2xl">
      <CardHeader>
        <div className="text-sm text-white/50 font-medium mb-2 uppercase tracking-wider">
          Question {currentNumber} of {totalQuestions}
        </div>
        <CardTitle className="text-xl md:text-2xl font-bold leading-tight text-white">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          return (
            <Button
              key={idx}
              variant="outline"
              className={`w-full justify-start text-left h-auto py-4 px-6 rounded-xl transition-all border ${
                isSelected
                  ? "border-indigo-400/50 bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/30 shadow-[0_0_12px_rgba(99,102,241,0.15)]"
                  : "border-white/10 bg-white/5 text-white/80 hover:border-indigo-400/30 hover:bg-white/10"
              }`}
              onClick={() => onSelectOption(option)}
            >
              <div className="flex gap-4 w-full">
                <span className={`font-bold shrink-0 ${isSelected ? "text-indigo-400" : "text-white/40"}`}>
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className="whitespace-pre-wrap">{option}</span>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}

