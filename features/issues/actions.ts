"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type IssueFormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

export async function createIssueAction(
  projectId: string,
  _prev: IssueFormState,
  formData: FormData,
): Promise<IssueFormState> {
  const session = await requireSession();
  try {
    await service.createIssue(session.userId, projectId, {
      title: formData.get("title"),
      description: formData.get("description"),
      type: formData.get("type") || undefined,
      dueDate: formData.get("dueDate") || undefined,
    });
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath(`/projects/${projectId}/issues`);
  return null;
}

export async function updateIssueStatusAction(projectId: string, id: string, status: string) {
  const session = await requireSession();
  await service.updateIssueStatus(session.userId, projectId, id, { status });
  revalidateOne(projectId, id);
}

export async function resolveIssueAction(
  projectId: string,
  id: string,
  _prev: IssueFormState,
  formData: FormData,
): Promise<IssueFormState> {
  const session = await requireSession();
  try {
    await service.resolveIssue(session.userId, projectId, id, { resolutionNote: formData.get("resolutionNote") });
  } catch (error) {
    return toFormState(error);
  }
  revalidateOne(projectId, id);
  return null;
}

export async function closeIssueAction(
  projectId: string,
  id: string,
  _prev: IssueFormState,
  formData: FormData,
): Promise<IssueFormState> {
  const session = await requireSession();
  try {
    await service.closeIssue(session.userId, projectId, id, { resolutionNote: formData.get("resolutionNote") });
  } catch (error) {
    return toFormState(error);
  }
  revalidateOne(projectId, id);
  return null;
}

function revalidateOne(projectId: string, id: string) {
  revalidatePath(`/projects/${projectId}/issues`);
  revalidatePath(`/projects/${projectId}/issues/${id}`);
}

function toFormState(error: unknown): IssueFormState {
  if (error instanceof AppError) {
    return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
  }
  console.error("[issues-action-error]", error);
  return { error: "אירעה שגיאה בלתי צפויה, נסו שוב" };
}
