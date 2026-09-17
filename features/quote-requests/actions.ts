"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type QuoteRequestFormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

export async function submitQuoteRequestAction(
  projectId: string,
  _prev: QuoteRequestFormState,
  formData: FormData,
): Promise<QuoteRequestFormState> {
  const session = await requireSession();
  const intent = formData.get("intent") === "send" ? "send" : "draft";
  let id: string;
  try {
    const created = await service.submitQuoteRequest(
      session.userId,
      projectId,
      {
        title: formData.get("title"),
        scopeText: formData.get("scopeText") || "",
        deadline: formData.get("deadline") || undefined,
        recipientProfessionalIds: formData.getAll("recipientProfessionalIds"),
        recipientSupplierIds: formData.getAll("recipientSupplierIds"),
      },
      intent,
    );
    id = created.id;
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath(`/projects/${projectId}/quote-requests`);
  redirect(`/projects/${projectId}/quote-requests/${id}`);
}

export async function sendDraftAction(projectId: string, id: string) {
  const session = await requireSession();
  await service.sendDraft(session.userId, projectId, id);
  revalidatePath(`/projects/${projectId}/quote-requests/${id}`);
}

export async function cancelQuoteRequestAction(projectId: string, id: string) {
  const session = await requireSession();
  await service.cancelQuoteRequest(session.userId, projectId, id);
  revalidatePath(`/projects/${projectId}/quote-requests/${id}`);
}

function toFormState(error: unknown): QuoteRequestFormState {
  if (error instanceof AppError) {
    return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
  }
  console.error("[quote-request-action-error]", error);
  return { error: "אירעה שגיאה בלתי צפויה, נסו שוב" };
}
