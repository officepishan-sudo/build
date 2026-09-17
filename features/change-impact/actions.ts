"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type ApproveChangeState = { error?: string } | null;

export async function approveChangeAction(
  projectId: string,
  _prev: ApproveChangeState,
  formData: FormData,
): Promise<ApproveChangeState> {
  const session = await requireSession();
  const returnTo = formData.get("returnTo")?.toString();
  try {
    await service.approveChange(session.userId, projectId, Object.fromEntries(formData.entries()));
  } catch (error) {
    if (error instanceof AppError) {
      return { error: error.message };
    }
    console.error("[approve-change-error]", error);
    return { error: "לא הצלחנו לאשר את השינוי, נסו שוב" };
  }
  revalidatePath(`/projects/${projectId}/change-impact`);
  redirect(returnTo && returnTo.startsWith("/") ? returnTo : `/projects/${projectId}`);
}
