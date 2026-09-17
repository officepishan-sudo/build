import type { DefectStatus } from "@prisma/client";

export const DEFECT_STATUS_LABEL: Record<DefectStatus, string> = {
  OPEN: "פתוח",
  IN_PROGRESS: "בטיפול",
  RESOLVED: "נפתר",
  IN_REVIEW: "בבדיקה",
  CLOSED: "סגור",
};

export const DEFECT_STATUS_TONE: Record<DefectStatus, "neutral" | "success" | "warning" | "info" | "danger"> = {
  OPEN: "danger",
  IN_PROGRESS: "info",
  RESOLVED: "warning",
  IN_REVIEW: "warning",
  CLOSED: "success",
};
