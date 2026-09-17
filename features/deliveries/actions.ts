"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type DeliveryFormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

export async function createDeliveryFromOrderAction(
  projectId: string,
  orderId: string,
  _prev: DeliveryFormState,
  formData: FormData,
): Promise<DeliveryFormState> {
  const session = await requireSession();
  try {
    await service.createDeliveryFromOrder(session.userId, projectId, orderId, {
      expectedDate: formData.get("expectedDate") || undefined,
      notes: formData.get("notes") || undefined,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
    }
    console.error("[deliveries-action-error]", error);
    return { error: "לא הצלחנו ליצור אספקה מההזמנה" };
  }
  revalidatePath(`/projects/${projectId}/deliveries`);
  revalidatePath(`/projects/${projectId}/orders/${orderId}`);
  redirect(`/projects/${projectId}/deliveries`);
}

export async function updateDeliveryStatusAction(projectId: string, deliveryId: string, status: string) {
  const session = await requireSession();
  await service.updateDeliveryStatus(session.userId, projectId, deliveryId, status);
  revalidatePath(`/projects/${projectId}/deliveries`);
}
