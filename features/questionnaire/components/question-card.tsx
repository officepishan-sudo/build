"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NeedsCheckBadge } from "@/components/ui/states";
import type { QuestionnaireFlowQuestion } from "../hooks/use-questionnaire-flow";

export function QuestionCard({
  question,
  currentAnswer,
  isPending,
  onAnswer,
  onUnknown,
}: {
  question: QuestionnaireFlowQuestion;
  currentAnswer?: { answerValue: string | null; isUnknown: boolean };
  isPending: boolean;
  onAnswer: (value: string) => void;
  onUnknown: () => void;
}) {
  const [value, setValue] = useState(currentAnswer?.answerValue ?? "");

  return (
    <Card className="max-w-xl">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h2 className="text-lg font-medium text-gray-900">{question.text}</h2>
        {currentAnswer?.isUnknown && <NeedsCheckBadge label="סומן כלא ידוע" />}
      </div>
      {question.helpText && <p className="mb-3 text-sm text-gray-500">{question.helpText}</p>}
      <textarea
        key={question.key}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        placeholder="התשובה שלכם..."
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" disabled={isPending || !value.trim()} onClick={() => onAnswer(value.trim())}>
          המשך
        </Button>
        <Button type="button" variant="secondary" disabled={isPending} onClick={onUnknown}>
          אני לא יודע
        </Button>
      </div>
    </Card>
  );
}
