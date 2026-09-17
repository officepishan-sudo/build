"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type CartFormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

function toFormState(error: unknown, fallback: string): CartFormState {
  if (error instanceof AppError) {
    return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
  }
  console.error("[cart-action-error]", error);
  return { error: fallback };
}

export async function addCartItemAction(
  projectId: string,
  _prev: CartFormState,
  formData: FormData,
): Promise<CartFormState> {
  const session = await requireSession();
  try {
    await service.addManualCartItem(session.userId, projectId, {
      description: formData.get("description"),
      quantity: formData.get("quantity"),
      unitPrice: formData.get("unitPrice") || undefined,
      supplierId: formData.get("supplierId") || undefined,
      phaseId: formData.get("phaseId") || undefined,
    });
  } catch (error) {
    return toFormState(error, "לא הצלחנו להוסיף את הפריט לעגלה");
  }
  revalidatePath(`/projects/${projectId}/cart`);
  return null;
}

export async function updateCartItemAction(
  projectId: string,
  cartItemId: string,
  _prev: CartFormState,
  formData: FormData,
): Promise<CartFormState> {
  const session = await requireSession();
  try {
    await service.updateCartItem(session.userId, projectId, cartItemId, {
      quantity: formData.get("quantity"),
      unitPrice: formData.get("unitPrice") || undefined,
      supplierId: formData.get("supplierId") || undefined,
      phaseId: formData.get("phaseId") || undefined,
    });
  } catch (error) {
    return toFormState(error, "לא הצלחנו לעדכן את הפריט");
  }
  revalidatePath(`/projects/${projectId}/cart`);
  redirect(`/projects/${projectId}/cart`);
}

export async function splitCartItemAction(
  projectId: string,
  cartItemId: string,
  _prev: CartFormState,
  formData: FormData,
): Promise<CartFormState> {
  const session = await requireSession();
  try {
    await service.splitCartItem(session.userId, projectId, cartItemId, {
      splitQuantity: formData.get("splitQuantity"),
    });
  } catch (error) {
    return toFormState(error, "לא הצלחנו לפצל את השורה");
  }
  revalidatePath(`/projects/${projectId}/cart`);
  redirect(`/projects/${projectId}/cart`);
}

export async function deleteCartItemAction(projectId: string, cartItemId: string) {
  const session = await requireSession();
  await service.removeCartItem(session.userId, projectId, cartItemId);
  revalidatePath(`/projects/${projectId}/cart`);
}
