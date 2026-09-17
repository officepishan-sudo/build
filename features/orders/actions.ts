"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type OrderFormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

function toFormState(error: unknown, fallback: string): OrderFormState {
  if (error instanceof AppError) {
    return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
  }
  console.error("[orders-action-error]", error);
  return { error: fallback };
}

export async function createOrdersFromCartAction(
  projectId: string,
  _prev: OrderFormState,
  formData: FormData,
): Promise<OrderFormState> {
  const session = await requireSession();
  try {
    await service.createOrdersFromCart(session.userId, projectId, {
      cartItemIds: formData.getAll("cartItemId"),
    });
  } catch (error) {
    return toFormState(error, "לא הצלחנו ליצור הזמנה מהעגלה");
  }
  revalidatePath(`/projects/${projectId}/cart`);
  revalidatePath(`/projects/${projectId}/orders`);
  redirect(`/projects/${projectId}/orders`);
}

export async function changeOrderStatusAction(projectId: string, orderId: string, status: string) {
  const session = await requireSession();
  await service.changeOrderStatus(session.userId, projectId, orderId, { status });
  revalidatePath(`/projects/${projectId}/orders/${orderId}`);
  revalidatePath(`/projects/${projectId}/orders`);
}

export async function deleteOrderAction(projectId: string, orderId: string) {
  const session = await requireSession();
  await service.deleteOrder(session.userId, projectId, orderId);
  revalidatePath(`/projects/${projectId}/orders`);
  redirect(`/projects/${projectId}/orders`);
}
