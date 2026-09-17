import type { OrderStatus } from "@prisma/client";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  DRAFT: "טיוטה",
  SENT: "נשלחה",
  CONFIRMED: "אושרה",
  IN_PROGRESS: "בטיפול",
  PARTIALLY_DELIVERED: "סופקה חלקית",
  DELIVERED: "סופקה",
  CANCELLED: "בוטלה",
};

export const ORDER_STATUS_TONE: Record<OrderStatus, "neutral" | "success" | "warning" | "info" | "danger"> = {
  DRAFT: "neutral",
  SENT: "info",
  CONFIRMED: "info",
  IN_PROGRESS: "warning",
  PARTIALLY_DELIVERED: "warning",
  DELIVERED: "success",
  CANCELLED: "danger",
};

// מעברי סטטוס מותרים - כל שינוי הוא פעולה מפורשת של המשתמש, לא דריסה שקטה.
export const ALLOWED_ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  DRAFT: ["SENT", "CANCELLED"],
  SENT: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["PARTIALLY_DELIVERED", "DELIVERED", "CANCELLED"],
  PARTIALLY_DELIVERED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

// סטטוסים "רגישים" - שינוי בהם מרגיש כמו החלטה מכוונת, לא קליק אקראי (P21 edge case).
export const STATUSES_REQUIRING_CONFIRM: OrderStatus[] = ["CONFIRMED", "DELIVERED", "CANCELLED"];
