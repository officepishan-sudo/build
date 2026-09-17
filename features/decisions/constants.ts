import type { DecisionStatus } from "@prisma/client";

export const DECISION_STATUS_LABEL: Record<DecisionStatus, string> = {
  OPEN: "פתוחה",
  DECIDED: "הוחלט",
  NEEDS_CHECK: "דורש בדיקה",
};

export const DECISION_STATUS_TONE: Record<DecisionStatus, "neutral" | "success" | "warning" | "info"> = {
  OPEN: "info",
  DECIDED: "success",
  NEEDS_CHECK: "warning",
};

// סדר הצגה: פתוחות קודם, אחר כך דורש בדיקה, ולבסוף הוחלט (כ"החלטות אחרונות").
export const DECISION_GROUP_ORDER: DecisionStatus[] = ["OPEN", "NEEDS_CHECK", "DECIDED"];

export const DECISION_GROUP_LABEL: Record<DecisionStatus, string> = {
  OPEN: "החלטות פתוחות",
  NEEDS_CHECK: "דורשות בדיקה",
  DECIDED: "החלטות אחרונות",
};
