"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useQuestionnaireFlow, type QuestionnaireFlowQuestion } from "../hooks/use-questionnaire-flow";
import type { QuestionnaireState } from "../types";
import { ProgressBar } from "./progress-bar";
import { QuestionCard } from "./question-card";

export function QuestionnaireFlow({
  projectId,
  questions,
  initialAnswers,
}: {
  projectId: string;
  questions: QuestionnaireFlowQuestion[];
  initialAnswers: QuestionnaireState["answers"];
}) {
  const router = useRouter();
  const flow = useQuestionnaireFlow(projectId, questions, initialAnswers);

  if (questions.length === 0) {
    return <p className="text-gray-500">אין עדיין שאלות מוגדרות במערכת.</p>;
  }

  return (
    <div>
      <ProgressBar current={flow.index} total={flow.total} />
      {flow.error && (
        <div className="mb-3 max-w-xl rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{flow.error}</div>
      )}
      <QuestionCard
        question={flow.current}
        currentAnswer={flow.currentAnswer}
        isPending={flow.isPending}
        onAnswer={flow.answerAndNext}
        onUnknown={flow.markUnknownAndNext}
      />
      <div className="mt-4 flex max-w-xl items-center justify-between">
        <Button type="button" variant="ghost" disabled={flow.index === 0} onClick={flow.goBack}>
          חזרה לשאלה הקודמת
        </Button>
        {flow.isLast && flow.isDone && (
          <Button type="button" onClick={() => router.push(`/projects/${projectId}/alternatives`)}>
            סיום - מעבר לחלופות
          </Button>
        )}
      </div>
    </div>
  );
}
