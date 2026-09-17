"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import * as service from "./service";

export async function updateTaskStatusAction(projectId: string, taskId: string, formData: FormData) {
  const session = await requireSession();
  await service.updateTaskStatus(session.userId, projectId, taskId, { status: formData.get("status") });
  revalidatePath(`/projects/${projectId}/execution`);
}
