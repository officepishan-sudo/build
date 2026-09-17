"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type QuantityFormState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string[]> } | null;

function readQuantityItemForm(formData: FormData) {
  return {
    phaseId: formData.get("phaseId") || undefined,
    category: formData.get("category"),
    description: formData.get("description"),
    quantity: formData.get("quantity"),
    unit: formData.get("unit"),
    materialCost: formData.get("materialCost") || undefined,
    laborCost: formData.get("laborCost") || undefined,
    transportCost: formData.get("transportCost") || undefined,
    totalCostOverride: formData.get("totalCostOverride") || undefined,
    source: formData.get("source") || undefined,
    needsCheck: formData.get("needsCheck") === "on",
  };
}

function toFormState(error: unknown): QuantityFormState {
  if (error instanceof AppError) {
    return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
  }
  console.error("[quantities-action-error]", error);
  return { error: "לא הצלחנו לשמור את השורה, נסו שוב" };
}

export async function createQuantityItemAction(
  projectId: string,
  _prev: QuantityFormState,
  formData: FormData,
): Promise<QuantityFormState> {
  const session = await requireSession();
  try {
    await service.createQuantityItem(session.userId, projectId, readQuantityItemForm(formData));
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath(`/projects/${projectId}/quantities`);
  return { ok: true };
}

export async function updateQuantityItemAction(
  projectId: string,
  itemId: string,
  _prev: QuantityFormState,
  formData: FormData,
): Promise<QuantityFormState> {
  const session = await requireSession();
  try {
    await service.updateQuantityItem(session.userId, projectId, itemId, readQuantityItemForm(formData));
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath(`/projects/${projectId}/quantities`);
  return { ok: true };
}

export async function deleteQuantityItemAction(projectId: string, itemId: string) {
  const session = await requireSession();
  await service.deleteQuantityItem(session.userId, projectId, itemId);
  revalidatePath(`/projects/${projectId}/quantities`);
}
