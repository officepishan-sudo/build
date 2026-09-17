"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type DocumentFormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

function toFormState(error: unknown): DocumentFormState {
  if (error instanceof AppError) {
    return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
  }
  console.error("[documents-action-error]", error);
  return { error: "אירעה שגיאה בלתי צפויה, נסו שוב" };
}

function readDocumentForm(formData: FormData) {
  return {
    category: formData.get("category"),
    name: formData.get("name"),
    fileUrl: formData.get("fileUrl") || undefined,
    notes: formData.get("notes") || undefined,
    relatedType: formData.get("relatedType") || undefined,
    relatedId: formData.get("relatedId") || undefined,
  };
}

export async function createDocumentAction(
  projectId: string,
  _prev: DocumentFormState,
  formData: FormData,
): Promise<DocumentFormState> {
  const session = await requireSession();
  try {
    await service.createDocument(session.userId, projectId, readDocumentForm(formData));
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath(`/projects/${projectId}/documents`);
  return null;
}

export async function updateDocumentAction(
  projectId: string,
  documentId: string,
  _prev: DocumentFormState,
  formData: FormData,
): Promise<DocumentFormState> {
  const session = await requireSession();
  try {
    await service.updateDocument(session.userId, projectId, documentId, readDocumentForm(formData));
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath(`/projects/${projectId}/documents`);
  redirect(`/projects/${projectId}/documents`);
}

export async function deleteDocumentAction(projectId: string, documentId: string) {
  const session = await requireSession();
  await service.deleteDocument(session.userId, projectId, documentId);
  revalidatePath(`/projects/${projectId}/documents`);
}
