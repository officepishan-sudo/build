import type { IssueStatus } from "@prisma/client";

export const ISSUE_STATUS_LABEL: Record<IssueStatus, string> = {
  OPEN: "פתוחה",
  IN_PROGRESS: "בטיפול",
  WAITING: "ממתינה",
  RESOLVED: "נפתרה",
  CLOSED: "סגורה",
};

export const ISSUE_STATUS_TONE: Record<IssueStatus, "neutral" | "success" | "warning" | "info" | "danger"> = {
  OPEN: "danger",
  IN_PROGRESS: "info",
  WAITING: "warning",
  RESOLVED: "success",
  CLOSED: "neutral",
};
