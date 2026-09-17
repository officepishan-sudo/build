"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type ShareFormState = { error?: string; info?: string; fieldErrors?: Record<string, string[]> } | null;

function toFormState(error: unknown): ShareFormState {
  if (error instanceof AppError) {
    return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
  }
  console.error("[sharing-action-error]", error);
  return { error: "אירעה שגיאה בלתי צפויה, נסו שוב" };
}

export async function inviteShareAction(
  projectId: string,
  _prev: ShareFormState,
  formData: FormData,
): Promise<ShareFormState> {
  const session = await requireSession();
  try {
    const result = await service.inviteUser(session.userId, projectId, {
      email: formData.get("email"),
      level: formData.get("level"),
      domain: formData.get("domain") || undefined,
    });
    if (result.status === "not_registered") {
      return { info: `המשתמש עם האימייל ${result.email} עדיין לא נרשם - שתפו איתו את הקישור לפרויקט` };
    }
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath(`/projects/${projectId}/sharing`);
  return null;
}

export async function changeShareLevelAction(
  projectId: string,
  shareId: string,
  _prev: ShareFormState,
  formData: FormData,
): Promise<ShareFormState> {
  const session = await requireSession();
  try {
    await service.changeShareLevel(session.userId, projectId, shareId, {
      level: formData.get("level"),
      domain: formData.get("domain") || undefined,
    });
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath(`/projects/${projectId}/sharing`);
  return null;
}

export async function removeShareAction(projectId: string, shareId: string) {
  const session = await requireSession();
  await service.removeShare(session.userId, projectId, shareId);
  revalidatePath(`/projects/${projectId}/sharing`);
}
