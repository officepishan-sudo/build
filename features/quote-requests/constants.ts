import type { QuoteRequestStatus } from "@prisma/client";

export const QUOTE_REQUEST_STATUS_LABEL: Record<QuoteRequestStatus, string> = {
  DRAFT: "טיוטה",
  SENT: "נשלחה",
  CANCELLED: "בוטלה",
};

export const QUOTE_REQUEST_STATUS_TONE: Record<QuoteRequestStatus, "neutral" | "success" | "warning" | "info"> = {
  DRAFT: "warning",
  SENT: "success",
  CANCELLED: "neutral",
};
