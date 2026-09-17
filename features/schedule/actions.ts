"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type ScheduleFormState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string[]> } | null;

function toFormState(error: unknown): ScheduleFormState {
  if (error instanceof AppError) {
    return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
  }
  console.error("[schedule-action-error]", error);
  return { error: "לא הצלחנו לשמור, נסו שוב" };
}

function readPhaseForm(formData: FormData) {
  return {
    name: formData.get("name"),
    startDate: formData.get("startDate") || undefined,
    endDate: formData.get("endDate") || undefined,
    status: formData.get("status") ?? "NOT_STARTED",
    dependsOnPhaseId: formData.get("dependsOnPhaseId") || undefined,
  };
}

function readTaskForm(formData: FormData) {
  return {
    title: formData.get("title"),
    assigneeProfessionalId: formData.get("assigneeProfessionalId") || undefined,
    startDate: formData.get("startDate") || undefined,
    endDate: formData.get("endDate") || undefined,
    status: formData.get("status") ?? "NOT_STARTED",
    notes: formData.get("notes") || undefined,
  };
}

export async function createPhaseAction(projectId: string, _prev: ScheduleFormState, formData: FormData): Promise<ScheduleFormState> {
  const session = await requireSession();
  try {
    await service.createPhase(session.userId, projectId, readPhaseForm(formData));
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath(`/projects/${projectId}/schedule`);
  return { ok: true };
}

export async function updatePhaseAction(
  projectId: string,
  phaseId: string,
  _prev: ScheduleFormState,
  formData: FormData,
): Promise<ScheduleFormState> {
  const session = await requireSession();
  try {
    await service.updatePhase(session.userId, projectId, phaseId, readPhaseForm(formData));
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath(`/projects/${projectId}/schedule`);
  return { ok: true };
}

export async function deletePhaseAction(projectId: string, phaseId: string) {
  const session = await requireSession();
  await service.deletePhase(session.userId, projectId, phaseId);
  revalidatePath(`/projects/${projectId}/schedule`);
}

export async function movePhaseAction(projectId: string, phaseId: string, direction: "up" | "down") {
  const session = await requireSession();
  await service.movePhase(session.userId, projectId, phaseId, direction);
  revalidatePath(`/projects/${projectId}/schedule`);
}

export async function createTaskAction(
  projectId: string,
  phaseId: string,
  _prev: ScheduleFormState,
  formData: FormData,
): Promise<ScheduleFormState> {
  const session = await requireSession();
  try {
    await service.createTask(session.userId, projectId, phaseId, readTaskForm(formData));
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath(`/projects/${projectId}/schedule`);
  return { ok: true };
}

export async function updateTaskAction(
  projectId: string,
  taskId: string,
  _prev: ScheduleFormState,
  formData: FormData,
): Promise<ScheduleFormState> {
  const session = await requireSession();
  try {
    await service.updateTask(session.userId, projectId, taskId, readTaskForm(formData));
  } catch (error) {
    return toFormState(error);
  }
  revalidatePath(`/projects/${projectId}/schedule`);
  return { ok: true };
}

export async function deleteTaskAction(projectId: string, taskId: string) {
  const session = await requireSession();
  await service.deleteTask(session.userId, projectId, taskId);
  revalidatePath(`/projects/${projectId}/schedule`);
}
