"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type DefectFormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

export async function createDefectAction(
  projectId: string,
  _prev: DefectFormState,
  formData: FormData,
): Promise<DefectFormState> {
  const session = await requireSession();
  try {
    await service.createDefect(session.userId, projectId, {
      title: formData.get("title"),
      description: formData.get("description"),
      dueDate: formData.get("dueDate") || undefined,
    });
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath(`/projects/${projectId}/punch-list`);
  return null;
}

export async function updateDefectStatusAction(projectId: string, id: string, status: string) {
  const session = await requireSession();
  await service.updateDefectStatus(session.userId, projectId, id, { status });
  revalidateOne(projectId, id);
}

export async function resolveDefectAction(
  projectId: string,
  id: string,
  _prev: DefectFormState,
  formData: FormData,
): Promise<DefectFormState> {
  const session = await requireSession();
  try {
    await service.resolveDefect(session.userId, projectId, id, { resolutionNotes: formData.get("resolutionNotes") });
  } catch (error) {
    return toFormState(error);
  }
  revalidateOne(projectId, id);
  return null;
}

export async function sendDefectForReviewAction(projectId: string, id: string) {
  const session = await requireSession();
  await service.sendDefectForReview(session.userId, projectId, id);
  revalidateOne(projectId, id);
}

export async function closeDefectAction(
  projectId: string,
  id: string,
  _prev: DefectFormState,
  formData: FormData,
): Promise<DefectFormState> {
  const session = await requireSession();
  try {
    await service.closeDefect(session.userId, projectId, id, { closingNote: formData.get("closingNote") });
  } catch (error) {
    return toFormState(error);
  }
  revalidateOne(projectId, id);
  return null;
}

function revalidateOne(projectId: string, id: string) {
  revalidatePath(`/projects/${projectId}/punch-list`);
  revalidatePath(`/projects/${projectId}/punch-list/${id}`);
}

function toFormState(error: unknown): DefectFormState {
  if (error instanceof AppError) {
    return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
  }
  console.error("[punch-list-action-error]", error);
  return { error: "אירעה שגיאה בלתי צפויה, נסו שוב" };
}
