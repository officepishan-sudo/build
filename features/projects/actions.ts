"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type ProjectFormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

export async function createProjectAction(_prev: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  const session = await requireSession();
  let projectId: string;
  try {
    const project = await service.createProject(session.userId, {
      name: formData.get("name"),
      type: formData.get("type"),
      scopeDescription: formData.get("scopeDescription") || undefined,
      startDateKnown: formData.get("startDateKnown") === "on",
      startDate: formData.get("startDate") || undefined,
      track: formData.get("track") ?? "FULL",
      isExistingProject: formData.get("isExistingProject") === "on",
    });
    projectId = project.id;
  } catch (error) {
    if (error instanceof AppError) {
      return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
    }
    console.error("[create-project-error]", error);
    return { error: "לא הצלחנו ליצור את הפרויקט, נסו שוב" };
  }
  revalidatePath("/");
  const existing = formData.get("isExistingProject") === "on";
  redirect(existing ? `/projects/${projectId}/intake` : `/projects/${projectId}/questionnaire`);
}

export async function pauseProjectAction(projectId: string, reason: string | undefined) {
  const session = await requireSession();
  await service.pauseProject(session.userId, projectId, { reason });
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/");
}

export async function resumeProjectAction(projectId: string) {
  const session = await requireSession();
  await service.resumeProject(session.userId, projectId);
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/");
}
