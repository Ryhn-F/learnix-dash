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
    <Card className="w-full max-w-2xl mx-auto border shadow-sm">
      <CardHeader>
        <div className="text-sm text-muted-foreground font-medium mb-2 uppercase tracking-wider">
          Question {currentNumber} of {totalQuestions}
        </div>
        <CardTitle className="text-xl md:text-2xl font-bold leading-tight">
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
              className={`w-full justify-start text-left h-auto py-4 px-6 rounded-xl transition-all ${
                isSelected
                  ? "border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 ring-1 ring-purple-500"
                  : "hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-900/10"
              }`}
              onClick={() => onSelectOption(option)}
            >
              <div className="flex gap-4 w-full">
                <span className="font-bold shrink-0 text-muted-foreground">
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
