"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import * as service from "./service";

export async function markReadAction(notificationId: string) {
  const session = await requireSession();
  await service.markNotificationRead(session.userId, notificationId);
  revalidatePath("/notifications");
}

// "פתח": מסמן כנקרא ומנווט ליעד המיושב (best-effort). בלי href - רק מסמן כנקרא.
export async function openNotificationAction(notificationId: string, href: string | null) {
  const session = await requireSession();
  await service.markNotificationRead(session.userId, notificationId);
  revalidatePath("/notifications");
  if (href) {
    redirect(href);
  }
}
