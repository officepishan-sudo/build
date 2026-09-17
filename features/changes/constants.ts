import type { ChangeStatus } from "@prisma/client";

export const CHANGE_STATUS_LABEL: Record<ChangeStatus, string> = {
  DRAFT: "טיוטה",
  CLARIFICATION: "בבירור",
  PROPOSED: "הוצע",
  APPROVAL: "ממתין לאישור",
  APPROVED: "אושר",
  REJECTED: "נדחה",
  DONE: "בוצע",
  CANCELLED: "בוטל",
};

export const CHANGE_STATUS_TONE: Record<ChangeStatus, "neutral" | "success" | "warning" | "info" | "danger"> = {
  DRAFT: "neutral",
  CLARIFICATION: "warning",
  PROPOSED: "info",
  APPROVAL: "warning",
  APPROVED: "success",
  REJECTED: "danger",
  DONE: "success",
  CANCELLED: "neutral",
};
