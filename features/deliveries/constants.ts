import type { DeliveryStatus } from "@prisma/client";

export const DELIVERY_STATUS_LABEL: Record<DeliveryStatus, string> = {
  PENDING: "ממתינה",
  SCHEDULED: "מתוכננת",
  IN_TRANSIT: "בדרך",
  RECEIVED: "התקבלה",
  PARTIAL: "התקבלה חלקית",
  LATE: "באיחור",
  CANCELLED: "בוטלה",
};

export const DELIVERY_STATUS_TONE: Record<DeliveryStatus, "neutral" | "success" | "warning" | "info" | "danger"> = {
  PENDING: "neutral",
  SCHEDULED: "info",
  IN_TRANSIT: "info",
  RECEIVED: "success",
  PARTIAL: "warning",
  LATE: "danger",
  CANCELLED: "danger",
};

// מסלול הסטטוסים הטבעי (P22): SCHEDULED → IN_TRANSIT → RECEIVED, עם יציאות ל-PARTIAL/LATE/CANCELLED.
export const ALLOWED_DELIVERY_TRANSITIONS: Record<DeliveryStatus, DeliveryStatus[]> = {
  PENDING: ["SCHEDULED", "CANCELLED"],
  SCHEDULED: ["IN_TRANSIT", "PARTIAL", "LATE", "CANCELLED"],
  IN_TRANSIT: ["RECEIVED", "PARTIAL", "LATE", "CANCELLED"],
  PARTIAL: ["RECEIVED", "CANCELLED"],
  LATE: ["IN_TRANSIT", "RECEIVED", "PARTIAL", "CANCELLED"],
  RECEIVED: [],
  CANCELLED: [],
};
