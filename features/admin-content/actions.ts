"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type TemplateFormState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string[]> } | null;

function readTemplateForm(formData: FormData) {
  return {
    type: formData.get("type"),
    key: formData.get("key"),
    payloadText: formData.get("payloadText"),
    status: formData.get("status") ?? "DRAFT",
  };
}

function toFormState(error: unknown): TemplateFormState {
  if (error instanceof AppError) {
    return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
  }
  console.error("[admin-content-action-error]", error);
  return { error: "לא הצלחנו לשמור, נסו שוב" };
}

export async function createTemplateAction(_prev: TemplateFormState, formData: FormData): Promise<TemplateFormState> {
  const session = await requireSession();
  let created;
  try {
    created = await service.createTemplate(session.userId, readTemplateForm(formData));
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath("/admin/content");
  redirect(`/admin/content/${created.id}`);
}

export async function updateTemplateAction(
  id: string,
  _prev: TemplateFormState,
  formData: FormData,
): Promise<TemplateFormState> {
  const session = await requireSession();
  try {
    await service.updateTemplate(session.userId, id, readTemplateForm(formData));
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath("/admin/content");
  revalidatePath(`/admin/content/${id}`);
  return { ok: true };
}

export async function publishTemplateAction(id: string) {
  const session = await requireSession();
  await service.setTemplateStatus(session.userId, id, "PUBLISHED");
  revalidatePath("/admin/content");
  revalidatePath(`/admin/content/${id}`);
}

export async function unpublishTemplateAction(id: string) {
  const session = await requireSession();
  await service.setTemplateStatus(session.userId, id, "DRAFT");
  revalidatePath("/admin/content");
  revalidatePath(`/admin/content/${id}`);
}

export async function deleteTemplateAction(id: string) {
  const session = await requireSession();
  await service.deleteTemplate(session.userId, id);
  revalidatePath("/admin/content");
  redirect("/admin/content");
}
