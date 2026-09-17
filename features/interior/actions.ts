"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type InteriorFormState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string[]> } | null;

function readRoomForm(formData: FormData) {
  return { name: formData.get("name"), notes: formData.get("notes") || undefined };
}

function readItemForm(formData: FormData) {
  return {
    category: formData.get("category"),
    decisionText: formData.get("decisionText") || undefined,
    quantity: formData.get("quantity") || undefined,
    productId: formData.get("productId") || undefined,
  };
}

function toFormState(error: unknown): InteriorFormState {
  if (error instanceof AppError) {
    return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
  }
  console.error("[interior-action-error]", error);
  return { error: "אירעה שגיאה בלתי צפויה, נסו שוב" };
}

function revalidateInterior(projectId: string) {
  revalidatePath(`/projects/${projectId}/interior`);
}

export async function createRoomAction(
  projectId: string,
  _prev: InteriorFormState,
  formData: FormData,
): Promise<InteriorFormState> {
  const session = await requireSession();
  try {
    await service.createRoom(session.userId, projectId, readRoomForm(formData));
  } catch (error) {
    return toFormState(error);
  }
  revalidateInterior(projectId);
  return { ok: true };
}

export async function updateRoomAction(
  projectId: string,
  roomId: string,
  _prev: InteriorFormState,
  formData: FormData,
): Promise<InteriorFormState> {
  const session = await requireSession();
  try {
    await service.updateRoom(session.userId, projectId, roomId, readRoomForm(formData));
  } catch (error) {
    return toFormState(error);
  }
  revalidateInterior(projectId);
  return { ok: true };
}

export async function deleteRoomAction(projectId: string, roomId: string) {
  const session = await requireSession();
  await service.deleteRoom(session.userId, projectId, roomId);
  revalidateInterior(projectId);
}

export async function createItemAction(
  projectId: string,
  roomId: string,
  _prev: InteriorFormState,
  formData: FormData,
): Promise<InteriorFormState> {
  const session = await requireSession();
  try {
    await service.createItem(session.userId, projectId, roomId, readItemForm(formData));
  } catch (error) {
    return toFormState(error);
  }
  revalidateInterior(projectId);
  return { ok: true };
}

export async function updateItemAction(
  projectId: string,
  roomId: string,
  itemId: string,
  _prev: InteriorFormState,
  formData: FormData,
): Promise<InteriorFormState> {
  const session = await requireSession();
  try {
    await service.updateItem(session.userId, projectId, roomId, itemId, readItemForm(formData));
  } catch (error) {
    return toFormState(error);
  }
  revalidateInterior(projectId);
  return { ok: true };
}

export async function deleteItemAction(projectId: string, roomId: string, itemId: string) {
  const session = await requireSession();
  await service.deleteItem(session.userId, projectId, roomId, itemId);
  revalidateInterior(projectId);
}
