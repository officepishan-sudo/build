import { prisma } from "@/lib/prisma";
import type { CreateNotificationInput } from "./schema";

export function listNotificationsForUser(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export function findNotificationById(id: string) {
  return prisma.notification.findUnique({ where: { id } });
}

export function markAsRead(id: string) {
  return prisma.notification.update({ where: { id }, data: { isRead: true } });
}

// עוזר ליצירת התראה - לשימוש עתידי של דומיינים אחרים (עדיין לא מחובר אוטומטית מאף מקום).
export function createNotification(data: CreateNotificationInput) {
  return prisma.notification.create({ data });
}
