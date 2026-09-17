"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type MessageFormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

export async function sendMessageAction(
  projectId: string,
  _prev: MessageFormState,
  formData: FormData,
): Promise<MessageFormState> {
  const session = await requireSession();
  try {
    await service.sendMessage(session.userId, projectId, {
      body: formData.get("body"),
      relatedType: formData.get("relatedType") || undefined,
      relatedId: formData.get("relatedId") || undefined,
      existingDocumentId: formData.get("existingDocumentId") || undefined,
      newDocumentName: formData.get("newDocumentName") || undefined,
      newDocumentUrl: formData.get("newDocumentUrl") || undefined,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
    }
    console.error("[send-message-error]", error);
    return { error: "לא הצלחנו לשלוח את ההודעה, נסו שוב" };
  }
  revalidatePath(`/projects/${projectId}/messages`);
  return null;
}
