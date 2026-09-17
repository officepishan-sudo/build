"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type SaveAnswerState = { ok: boolean; error?: string } | null;

export async function saveAnswerAction(
  projectId: string,
  input: { questionKey: string; answerValue?: string; isUnknown: boolean },
): Promise<SaveAnswerState> {
  const session = await requireSession();
  try {
    await service.saveAnswer(session.userId, projectId, input);
  } catch (error) {
    if (error instanceof AppError) {
      return { ok: false, error: error.message };
    }
    console.error("[save-answer-error]", error);
    return { ok: false, error: "לא הצלחנו לשמור את התשובה, נסו שוב" };
  }
  revalidatePath(`/projects/${projectId}/questionnaire`);
  return { ok: true };
}
