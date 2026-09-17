"use client";

import { useMemo, useState, useTransition } from "react";
import { saveAnswerAction } from "../actions";
import type { QuestionnaireState } from "../types";

export type QuestionnaireFlowQuestion = QuestionnaireState["questions"][number];

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
  const firstUnanswered = useMemo(() => {
    const idx = questions.findIndex((q) => !(q.key in initialAnswers));
    return idx === -1 ? Math.max(0, questions.length - 1) : idx;
  }, [questions, initialAnswers]);

  const [index, setIndex] = useState(firstUnanswered);
  const [answers, setAnswers] = useState(initialAnswers);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const current = questions[index];
  const isLast = questions.length === 0 || index >= questions.length - 1;
  const isDone = questions.length > 0 && questions.every((q) => q.key in answers);

  function persist(questionKey: string, answerValue: string | undefined, isUnknown: boolean) {
    setAnswers((prev) => ({ ...prev, [questionKey]: { answerValue: answerValue ?? null, isUnknown } }));
    startTransition(async () => {
      const result = await saveAnswerAction(projectId, { questionKey, answerValue, isUnknown });
      setError(result && !result.ok ? (result.error ?? "שמירה נכשלה") : null);
    });
  }

  function answerAndNext(answerValue: string) {
    if (!current) return;
    persist(current.key, answerValue, false);
    if (!isLast) setIndex((i) => i + 1);
  }

  function markUnknownAndNext() {
    if (!current) return;
    persist(current.key, undefined, true);
    if (!isLast) setIndex((i) => i + 1);
  }

  function goBack() {
    setIndex((i) => Math.max(0, i - 1));
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
    answerAndNext,
    markUnknownAndNext,
    goBack,
  };
}
