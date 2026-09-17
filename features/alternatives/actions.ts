"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type AlternativeFormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

export async function createAlternativeAction(
  projectId: string,
  _prev: AlternativeFormState,
  formData: FormData,
): Promise<AlternativeFormState> {
  const session = await requireSession();
  try {
    await service.createAlternative(session.userId, projectId, Object.fromEntries(formData.entries()));
  } catch (error) {
    if (error instanceof AppError) {
      return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
    }
    console.error("[create-alternative-error]", error);
    return { error: "לא הצלחנו ליצור את החלופה, נסו שוב" };
  }
  revalidatePath(`/projects/${projectId}/alternatives`);
  return null;
}

export async function confirmSelectAlternativeAction(projectId: string, alternativeId: string, reason: string) {
  const session = await requireSession();
  await service.confirmSelectAlternative(session.userId, projectId, alternativeId, { reason });
  revalidatePath(`/projects/${projectId}/alternatives`);
  revalidatePath(`/projects/${projectId}/alternatives/${alternativeId}`);
  redirect(`/projects/${projectId}/alternatives/${alternativeId}`);
}

export async function applyPlayChangesAction(
  projectId: string,
  alternativeId: string,
  input: { priceMin: number; priceMax: number; durationDays?: number; maintenanceNotes?: string },
) {
  const session = await requireSession();
  await service.applyPlayChanges(session.userId, projectId, alternativeId, input);
  revalidatePath(`/projects/${projectId}/alternatives/${alternativeId}`);
  revalidatePath(`/projects/${projectId}/alternatives/${alternativeId}/play`);
}
