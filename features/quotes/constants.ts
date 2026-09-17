import type { QuoteStatus } from "@prisma/client";

export const QUOTE_STATUS_LABEL: Record<QuoteStatus, string> = {
  RECEIVED: "התקבלה",
  REVIEW: "בבדיקה",
  SELECTED: "נבחרה",
  REJECTED: "נדחתה",
  EXPIRED: "פגה",
  CANCELLED: "בוטלה",
};

export const QUOTE_STATUS_TONE: Record<QuoteStatus, "neutral" | "success" | "warning" | "info" | "danger"> = {
  RECEIVED: "info",
  REVIEW: "warning",
  SELECTED: "success",
  REJECTED: "danger",
  EXPIRED: "neutral",
  CANCELLED: "neutral",
};

// הצעה במצב הזה כבר טופלה - לא ניתן עוד "לבחור"/"לדחות" אותה.
export const QUOTE_DECIDED_STATUSES: QuoteStatus[] = ["SELECTED", "REJECTED", "EXPIRED", "CANCELLED"];
