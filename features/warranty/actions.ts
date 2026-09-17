"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type WarrantyFormState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string[]> } | null;

function readWarrantyForm(formData: FormData) {
  return {
    itemDescription: formData.get("itemDescription"),
    supplierId: formData.get("supplierId") || undefined,
    professionalId: formData.get("professionalId") || undefined,
    startDate: formData.get("startDate"),
    durationMonths: formData.get("durationMonths"),
  };
}

function readMaintenanceForm(formData: FormData) {
  return {
    title: formData.get("title"),
    frequency: formData.get("frequency") || undefined,
    nextDueDate: formData.get("nextDueDate") || undefined,
    notes: formData.get("notes") || undefined,
    warrantyId: formData.get("warrantyId") || undefined,
  };
}

function toFormState(error: unknown): WarrantyFormState {
  if (error instanceof AppError) {
    return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
  }
  console.error("[warranty-action-error]", error);
  return { error: "אירעה שגיאה בלתי צפויה, נסו שוב" };
}

function revalidateWarranty(projectId: string) {
  revalidatePath(`/projects/${projectId}/warranty`);
  revalidatePath(`/projects/${projectId}/book`);
}

export async function createWarrantyAction(
  projectId: string,
  _prev: WarrantyFormState,
  formData: FormData,
): Promise<WarrantyFormState> {
  const session = await requireSession();
  try {
    await service.createWarranty(session.userId, projectId, readWarrantyForm(formData));
  } catch (error) {
    return toFormState(error);
  }
  revalidateWarranty(projectId);
  return { ok: true };
}

export async function deleteWarrantyAction(projectId: string, warrantyId: string) {
  const session = await requireSession();
  await service.deleteWarranty(session.userId, projectId, warrantyId);
  revalidateWarranty(projectId);
}

export async function createMaintenanceItemAction(
  projectId: string,
  _prev: WarrantyFormState,
  formData: FormData,
): Promise<WarrantyFormState> {
  const session = await requireSession();
  try {
    await service.createMaintenanceItem(session.userId, projectId, readMaintenanceForm(formData));
  } catch (error) {
    return toFormState(error);
  }
  revalidateWarranty(projectId);
  return { ok: true };
}

export async function deleteMaintenanceItemAction(projectId: string, itemId: string) {
  const session = await requireSession();
  await service.deleteMaintenanceItem(session.userId, projectId, itemId);
  revalidateWarranty(projectId);
}
