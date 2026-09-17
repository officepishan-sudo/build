"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type PaymentFormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

export async function createPaymentAction(
  projectId: string,
  _prev: PaymentFormState,
  formData: FormData,
): Promise<PaymentFormState> {
  const session = await requireSession();
  try {
    await service.createPayment(session.userId, projectId, {
      payeeName: formData.get("payeeName"),
      amount: formData.get("amount"),
      dueDate: formData.get("dueDate") || undefined,
    });
  } catch (error) {
    return toFormState(error);
  }
  revalidatePayments(projectId);
  return null;
}

export async function markPaymentPaidAction(projectId: string, paymentId: string) {
  const session = await requireSession();
  await service.markPaymentPaid(session.userId, projectId, paymentId, {});
  revalidatePayments(projectId);
}

export async function updatePaymentStatusAction(
  projectId: string,
  paymentId: string,
  _prev: PaymentFormState,
  formData: FormData,
): Promise<PaymentFormState> {
  const session = await requireSession();
  try {
    await service.updatePaymentStatus(session.userId, projectId, paymentId, {
      status: formData.get("status"),
      paidDate: formData.get("paidDate") || undefined,
    });
  } catch (error) {
    return toFormState(error);
  }
  revalidatePayments(projectId);
  return null;
}

function revalidatePayments(projectId: string) {
  revalidatePath(`/projects/${projectId}/payments`);
  revalidatePath(`/projects/${projectId}/budget`);
}

function toFormState(error: unknown): PaymentFormState {
  if (error instanceof AppError) {
    return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
  }
  console.error("[payments-action-error]", error);
  return { error: "אירעה שגיאה בלתי צפויה, נסו שוב" };
}
