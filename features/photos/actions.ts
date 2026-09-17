"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type PhotoFormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

function toFormState(error: unknown): PhotoFormState {
  if (error instanceof AppError) {
    return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
  }
  console.error("[photos-action-error]", error);
  return { error: "אירעה שגיאה בלתי צפויה, נסו שוב" };
}

function readPhotoForm(formData: FormData) {
  return {
    url: formData.get("url"),
    takenAt: formData.get("takenAt") || undefined,
    phaseId: formData.get("phaseId") || undefined,
    caption: formData.get("caption") || undefined,
    isBeforeAfter: formData.get("isBeforeAfter") === "on",
  };
}

export async function addPhotoAction(
  projectId: string,
  _prev: PhotoFormState,
  formData: FormData,
): Promise<PhotoFormState> {
  const session = await requireSession();
  try {
    await service.addPhoto(session.userId, projectId, readPhotoForm(formData));
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath(`/projects/${projectId}/photos`);
  return null;
}

export async function editPhotoAction(
  projectId: string,
  photoId: string,
  _prev: PhotoFormState,
  formData: FormData,
): Promise<PhotoFormState> {
  const session = await requireSession();
  try {
    await service.editPhoto(session.userId, projectId, photoId, readPhotoForm(formData));
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath(`/projects/${projectId}/photos`);
  return null;
}
