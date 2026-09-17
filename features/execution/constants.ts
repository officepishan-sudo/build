import type { TaskStatus, PhaseStatus } from "@prisma/client";

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  NOT_STARTED: "טרם התחיל",
  IN_PROGRESS: "בביצוע",
  DONE: "הושלם",
  DELAYED: "בעיכוב",
};

export const TASK_STATUS_TONE: Record<TaskStatus, "neutral" | "success" | "warning" | "info"> = {
  NOT_STARTED: "neutral",
  IN_PROGRESS: "info",
  DONE: "success",
  DELAYED: "warning",
};

export const PHASE_STATUS_LABEL: Record<PhaseStatus, string> = {
  NOT_STARTED: "טרם התחיל",
  IN_PROGRESS: "בביצוע",
  DONE: "הושלם",
  DELAYED: "בעיכוב",
};

export const PHASE_STATUS_TONE: Record<PhaseStatus, "neutral" | "success" | "warning" | "info"> = {
  NOT_STARTED: "neutral",
  IN_PROGRESS: "info",
  DONE: "success",
  DELAYED: "warning",
};
