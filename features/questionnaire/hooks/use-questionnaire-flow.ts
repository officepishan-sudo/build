"use client";

import { useMemo, useState, useTransition } from "react";
import { saveAnswerAction } from "../actions";
import type { QuestionnaireState } from "../types";

export type QuestionnaireFlowQuestion = QuestionnaireState["questions"][number];

function findFirstUnansweredIndex(questions: QuestionnaireFlowQuestion[], answers: QuestionnaireState["answers"]): number {
  const idx = questions.findIndex((q) => !(q.key in answers));
  return idx === -1 ? Math.max(0, questions.length - 1) : idx;
}

/**
 * מנוע השאלון בצד הלקוח: שאלה אחת בכל פעם, שמירה אוטומטית לכל תשובה, חזרה
 * לשאלה קודמת בלי לאבד תשובות אחרות. ראו דוח הסוכן לגבי "רענון ענפים חכם" (פער ידוע).
 * questions יכול להיות ריק תיאורטית (עוד לפני ensureDefaultQuestions) - ה-hook נשאר
 * בטוח לקריאה במקרה הזה; הרכיב הקורא מציג מסך חלופי כשאין שאלות.
 */
export function useQuestionnaireFlow(
  projectId: string,
  questions: QuestionnaireFlowQuestion[],
  initialAnswers: QuestionnaireState["answers"],
) {
  const firstUnanswered = useMemo(() => findFirstUnansweredIndex(questions, initialAnswers), [questions, initialAnswers]);

  const [index, setIndex] = useState(firstUnanswered);
  const [answers, setAnswers] = useState(initialAnswers);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const current = questions[index];
  const isLast = questions.length === 0 || index >= questions.length - 1;
  const isDone = questions.length > 0 && questions.every((q) => q.key in answers);

  function advance(answerValue: string | undefined, isUnknown: boolean) {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.key]: { answerValue: answerValue ?? null, isUnknown } }));
    startTransition(async () => {
      const result = await saveAnswerAction(projectId, { questionKey: current.key, answerValue, isUnknown });
      setError(result && !result.ok ? (result.error ?? "שמירה נכשלה") : null);
    });
    if (!isLast) setIndex((i) => i + 1);
  }

  return {
    current,
    index,
    total: questions.length,
    isLast,
    isDone,
    isPending,
    error,
    currentAnswer: current ? answers[current.key] : undefined,
    answerAndNext: (value: string) => advance(value, false),
    markUnknownAndNext: () => advance(undefined, true),
    goBack: () => setIndex((i) => Math.max(0, i - 1)),
  };
}
