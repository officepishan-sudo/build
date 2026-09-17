import type { NotificationType } from "@prisma/client";

export const NOTIFICATION_TYPE_LABEL: Record<NotificationType, string> = {
  INFO: "מידע",
  WARNING: "אזהרה",
  ACTION_REQUIRED: "דורש פעולה",
};

export const NOTIFICATION_TYPE_TONE: Record<NotificationType, "neutral" | "warning" | "danger"> = {
  INFO: "neutral",
  WARNING: "warning",
  ACTION_REQUIRED: "danger",
};

// מיפוי best-effort בין sourceType למסלול ידוע באפליקציה. sourceType שלא ברשימה = טקסט בלבד, בלי קישור.
const SOURCE_ROUTE_BUILDERS: Record<string, (projectId: string, sourceId: string) => string> = {
  decision: (projectId, sourceId) => `/projects/${projectId}/decisions/${sourceId}`,
  message: (projectId) => `/projects/${projectId}/messages`,
  document: (projectId) => `/projects/${projectId}/documents`,
  photo: (projectId) => `/projects/${projectId}/photos`,
  sharing: (projectId) => `/projects/${projectId}/sharing`,
  issue: (projectId) => `/projects/${projectId}/issues`,
  task: (projectId) => `/projects/${projectId}/schedule`,
  order: (projectId) => `/projects/${projectId}/orders`,
  quote: (projectId) => `/projects/${projectId}/quotes`,
  project: (projectId) => `/projects/${projectId}`,
};

export function resolveNotificationHref(notification: {
  projectId: string;
  sourceType: string | null;
  sourceId: string | null;
}): string | null {
  if (!notification.sourceType) return null;
  const builder = SOURCE_ROUTE_BUILDERS[notification.sourceType];
  if (!builder) return null;
  return builder(notification.projectId, notification.sourceId ?? "");
}
