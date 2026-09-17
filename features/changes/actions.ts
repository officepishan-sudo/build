"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type ChangeFormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

export async function createChangeRequestAction(
  projectId: string,
  _prev: ChangeFormState,
  formData: FormData,
): Promise<ChangeFormState> {
  const session = await requireSession();
  try {
    await service.createChangeRequest(session.userId, projectId, {
      title: formData.get("title"),
      reason: formData.get("reason"),
      priceImpact: formData.get("priceImpact") || undefined,
      scheduleImpactDays: formData.get("scheduleImpactDays") || undefined,
    });
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath(`/projects/${projectId}/changes`);
  return null;
}

export async function updateChangeRequestAction(
  projectId: string,
  id: string,
  _prev: ChangeFormState,
  formData: FormData,
): Promise<ChangeFormState> {
  const session = await requireSession();
  try {
    await service.updateChangeRequestDetails(session.userId, projectId, id, {
      title: formData.get("title"),
      reason: formData.get("reason"),
      priceImpact: formData.get("priceImpact") || undefined,
      scheduleImpactDays: formData.get("scheduleImpactDays") || undefined,
    });
  } catch (error) {
    return toFormState(error);
  }
  revalidateOne(projectId, id);
  return null;
}

export async function moveChangeStatusAction(projectId: string, id: string, targetStatus: string) {
  const session = await requireSession();
  await service.moveToStatus(session.userId, projectId, id, targetStatus);
  revalidateOne(projectId, id);
}

export async function approveChangeRequestAction(projectId: string, id: string) {
  const session = await requireSession();
  await service.approveChangeRequest(session.userId, projectId, id);
  revalidateOne(projectId, id);
}

export async function rejectChangeRequestAction(projectId: string, id: string) {
  const session = await requireSession();
  await service.rejectChangeRequest(session.userId, projectId, id);
  revalidateOne(projectId, id);
}

export async function cancelChangeRequestAction(projectId: string, id: string) {
  const session = await requireSession();
  await service.cancelChangeRequest(session.userId, projectId, id);
  revalidateOne(projectId, id);
}

export async function markChangeDoneAction(projectId: string, id: string) {
  const session = await requireSession();
  await service.markChangeDone(session.userId, projectId, id);
  revalidateOne(projectId, id);
}

export async function deleteDraftChangeRequestAction(projectId: string, id: string) {
  const session = await requireSession();
  await service.deleteDraftChangeRequest(session.userId, projectId, id);
  revalidatePath(`/projects/${projectId}/changes`);
  redirect(`/projects/${projectId}/changes`);
}

function revalidateOne(projectId: string, id: string) {
  revalidatePath(`/projects/${projectId}/changes`);
  revalidatePath(`/projects/${projectId}/changes/${id}`);
}

function toFormState(error: unknown): ChangeFormState {
  if (error instanceof AppError) {
    return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
  }
  console.error("[changes-action-error]", error);
  return { error: "אירעה שגיאה בלתי צפויה, נסו שוב" };
}
