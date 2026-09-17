"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type QuoteFormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

export async function createQuoteAction(
  projectId: string,
  _prev: QuoteFormState,
  formData: FormData,
): Promise<QuoteFormState> {
  const session = await requireSession();
  try {
    await service.createQuote(session.userId, projectId, {
      price: formData.get("price"),
      professionalId: formData.get("professionalId") || undefined,
      supplierId: formData.get("supplierId") || undefined,
      quoteRequestId: formData.get("quoteRequestId") || undefined,
      includesNotes: formData.get("includesNotes") || undefined,
      durationDays: formData.get("durationDays") || undefined,
      paymentTerms: formData.get("paymentTerms") || undefined,
      warrantyText: formData.get("warrantyText") || undefined,
      notes: formData.get("notes") || undefined,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
    }
    console.error("[create-quote-error]", error);
    return { error: "לא הצלחנו להוסיף את ההצעה, נסו שוב" };
  }
  revalidatePath(`/projects/${projectId}/quotes`);
  return null;
}

export async function selectQuoteAction(projectId: string, quoteId: string) {
  const session = await requireSession();
  await service.selectQuote(session.userId, projectId, quoteId);
  revalidatePath(`/projects/${projectId}/quotes`);
  revalidatePath(`/projects/${projectId}/quotes/${quoteId}`);
}

export async function rejectQuoteAction(projectId: string, quoteId: string) {
  const session = await requireSession();
  await service.rejectQuote(session.userId, projectId, quoteId);
  revalidatePath(`/projects/${projectId}/quotes`);
  revalidatePath(`/projects/${projectId}/quotes/${quoteId}`);
}
