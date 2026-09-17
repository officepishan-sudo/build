import { ForbiddenError, NotFoundError } from "@/lib/errors";
import { createNotificationSchema } from "./schema";
import * as repo from "./repository";

// גלובלי, לא project-scoped: מסתמכים על session בלבד ומסננים לפי userId (לא requireProjectAccess).
export async function listMyNotifications(userId: string) {
  return repo.listNotificationsForUser(userId);
}

export async function markNotificationRead(userId: string, notificationId: string) {
  const notification = await repo.findNotificationById(notificationId);
  if (!notification) throw new NotFoundError("התראה");
  if (notification.userId !== userId) throw new ForbiddenError();
  return repo.markAsRead(notificationId);
}

// עוזר לשימוש עתידי של דומיינים אחרים (איחור באספקה, החלטה שעברה דדליין וכו') - לא מחובר אוטומטית הלילה.
export async function createNotification(input: unknown) {
  const data = createNotificationSchema.parse(input);
  return repo.createNotification(data);
}
