"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type CanvasFormState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string[]> } | null;

function readPinForm(formData: FormData) {
  return {
    x: formData.get("x"),
    y: formData.get("y"),
    label: formData.get("label"),
    note: formData.get("note") || undefined,
    linkedRequirementId: formData.get("linkedRequirementId") || undefined,
  };
}

function toFormState(error: unknown): CanvasFormState {
  if (error instanceof AppError) {
    return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
  }
  console.error("[canvas-action-error]", error);
  return { error: "אירעה שגיאה בלתי צפויה, נסו שוב" };
}

function revalidateCanvas(projectId: string) {
  revalidatePath(`/projects/${projectId}/canvas`);
}

export async function setBaseImageAction(
  projectId: string,
  _prev: CanvasFormState,
  formData: FormData,
): Promise<CanvasFormState> {
  const session = await requireSession();
  try {
    await service.setBaseImage(session.userId, projectId, { imageUrl: formData.get("imageUrl") });
  } catch (error) {
    return toFormState(error);
  }
  revalidateCanvas(projectId);
  return { ok: true };
}

export async function createPinAction(
  projectId: string,
  _prev: CanvasFormState,
  formData: FormData,
): Promise<CanvasFormState> {
  const session = await requireSession();
  try {
    await service.createPin(session.userId, projectId, readPinForm(formData));
  } catch (error) {
    return toFormState(error);
  }
  revalidateCanvas(projectId);
  return { ok: true };
}

export async function updatePinAction(
  projectId: string,
  pinId: string,
  _prev: CanvasFormState,
  formData: FormData,
): Promise<CanvasFormState> {
  const session = await requireSession();
  try {
    await service.updatePin(session.userId, projectId, pinId, readPinForm(formData));
  } catch (error) {
    return toFormState(error);
  }
  revalidateCanvas(projectId);
  return { ok: true };
}

export async function deletePinAction(projectId: string, pinId: string) {
  const session = await requireSession();
  await service.deletePin(session.userId, projectId, pinId);
  revalidateCanvas(projectId);
}
