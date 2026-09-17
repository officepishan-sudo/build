"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type DecisionFormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

export async function createDecisionAction(
  projectId: string,
  _prev: DecisionFormState,
  formData: FormData,
): Promise<DecisionFormState> {
  const session = await requireSession();
  try {
    await service.createDecision(session.userId, projectId, {
      title: formData.get("title"),
      description: formData.get("description") || undefined,
      deadline: formData.get("deadline") || undefined,
      dependsOn: formData.get("dependsOn") || undefined,
    });
  } catch (error) {
    return toFormState(error);
  }
  revalidateDecisions(projectId);
  return null;
}

export async function markDecidedAction(
  projectId: string,
  decisionId: string,
  _prev: DecisionFormState,
  formData: FormData,
): Promise<DecisionFormState> {
  const session = await requireSession();
  try {
    await service.markDecided(session.userId, projectId, decisionId, {
      decidedValue: formData.get("decidedValue"),
    });
  } catch (error) {
    return toFormState(error);
  }
  revalidateDecisions(projectId);
  return null;
}

export async function markNeedsCheckAction(projectId: string, decisionId: string) {
  const session = await requireSession();
  await service.markNeedsCheck(session.userId, projectId, decisionId);
  revalidateDecisions(projectId);
}

export async function markOpenAction(projectId: string, decisionId: string) {
  const session = await requireSession();
  await service.markOpen(session.userId, projectId, decisionId);
  revalidateDecisions(projectId);
}

function revalidateDecisions(projectId: string) {
  revalidatePath(`/projects/${projectId}/decisions`);
  revalidatePath(`/projects/${projectId}`);
}

function toFormState(error: unknown): DecisionFormState {
  if (error instanceof AppError) {
    return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
  }
  console.error("[decisions-action-error]", error);
  return { error: "אירעה שגיאה בלתי צפויה, נסו שוב" };
}
