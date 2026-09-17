"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type BudgetFormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

export async function createBudgetLineAction(
  projectId: string,
  _prev: BudgetFormState,
  formData: FormData,
): Promise<BudgetFormState> {
  const session = await requireSession();
  try {
    await service.createBudgetLine(session.userId, projectId, {
      category: formData.get("category"),
      plannedAmount: formData.get("plannedAmount"),
      committedAmount: formData.get("committedAmount") || undefined,
    });
  } catch (error) {
    return toFormState(error);
  }
  revalidateBudget(projectId);
  return null;
}

export async function updateBudgetLineAction(
  projectId: string,
  lineId: string,
  _prev: BudgetFormState,
  formData: FormData,
): Promise<BudgetFormState> {
  const session = await requireSession();
  try {
    await service.updateBudgetLine(session.userId, projectId, lineId, {
      category: formData.get("category"),
      plannedAmount: formData.get("plannedAmount"),
      committedAmount: formData.get("committedAmount") || undefined,
    });
  } catch (error) {
    return toFormState(error);
  }
  revalidateBudget(projectId);
  return null;
}

export async function setVarianceReasonAction(
  projectId: string,
  lineId: string,
  _prev: BudgetFormState,
  formData: FormData,
): Promise<BudgetFormState> {
  const session = await requireSession();
  try {
    await service.setVarianceReason(session.userId, projectId, lineId, {
      varianceReason: formData.get("varianceReason"),
    });
  } catch (error) {
    return toFormState(error);
  }
  revalidateBudget(projectId);
  return null;
}

export async function logExpenseAction(
  projectId: string,
  lineId: string,
  _prev: BudgetFormState,
  formData: FormData,
): Promise<BudgetFormState> {
  const session = await requireSession();
  try {
    await service.logExpense(session.userId, projectId, lineId, {
      description: formData.get("description"),
      amount: formData.get("amount"),
      date: formData.get("date") || undefined,
    });
  } catch (error) {
    return toFormState(error);
  }
  revalidateBudget(projectId);
  return null;
}

function revalidateBudget(projectId: string) {
  revalidatePath(`/projects/${projectId}/budget`);
  revalidatePath(`/projects/${projectId}`);
}

function toFormState(error: unknown): BudgetFormState {
  if (error instanceof AppError) {
    return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
  }
  console.error("[budget-action-error]", error);
  return { error: "אירעה שגיאה בלתי צפויה, נסו שוב" };
}
