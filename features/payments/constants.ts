import type { PaymentStatus } from "@prisma/client";

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  PENDING: "ממתין",
  PAID: "שולם",
  PARTIAL: "שולם חלקית",
  OVERDUE: "באיחור",
  CANCELLED: "בוטל",
};

export const PAYMENT_STATUS_TONE: Record<PaymentStatus, "neutral" | "success" | "warning" | "info" | "danger"> = {
  PENDING: "info",
  PAID: "success",
  PARTIAL: "warning",
  OVERDUE: "danger",
  CANCELLED: "neutral",
};
