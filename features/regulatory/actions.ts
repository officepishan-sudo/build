"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import * as service from "./service";

function revalidateRegulatory(projectId: string) {
  revalidatePath(`/projects/${projectId}/regulatory`);
  revalidatePath(`/projects/${projectId}/book`);
}

export async function seedChecklistAction(projectId: string) {
  const session = await requireSession();
  await service.seedChecklist(session.userId, projectId);
  revalidateRegulatory(projectId);
}

export async function updateChecklistItemAction(projectId: string, itemId: string, formData: FormData) {
  const session = await requireSession();
  await service.updateChecklistItem(session.userId, projectId, itemId, {
    isChecked: formData.get("isChecked") === "on",
    notes: formData.get("notes") || undefined,
  });
  revalidateRegulatory(projectId);
}
