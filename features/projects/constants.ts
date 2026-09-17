import type { ProjectStatus, ProjectType } from "@prisma/client";

export const PROJECT_TYPE_LABEL: Record<ProjectType, string> = {
  NEW_HOME: "בניית בית",
  RENOVATION: "שיפוץ",
  YARD_GARDEN: "חצר וגינה",
  FENCE_GATE: "גדר ושער",
  PARKING: "חניה",
  PERGOLA: "פרגולה",
  INFRASTRUCTURE: "תשתיות",
  INTERIOR_DESIGN: "תכנון ועיצוב פנים",
  OTHER: "אחר",
};

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  NEW: "חדש",
  PLANNING: "בתכנון",
  PREPARING: "בהכנה",
  IN_PROGRESS: "בביצוע",
  PAUSED: "מושהה",
  COMPLETED: "הושלם",
  ARCHIVED: "ארכיון",
};

export const PROJECT_STATUS_TONE: Record<ProjectStatus, "neutral" | "success" | "warning" | "info"> = {
  NEW: "neutral",
  PLANNING: "info",
  PREPARING: "info",
  IN_PROGRESS: "success",
  PAUSED: "warning",
  COMPLETED: "success",
  ARCHIVED: "neutral",
};
