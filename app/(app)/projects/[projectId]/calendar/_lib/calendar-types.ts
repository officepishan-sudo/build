// טיפוסים משותפים ללוח השנה המאוחד (P26) - אגרגציה חוצת-דומיין ברמת עמוד בלבד.

export type CalendarEventType = "task" | "delivery" | "payment" | "decision";

export type CalendarEvent = {
  id: string;
  type: CalendarEventType;
  date: Date;
  title: string;
  subtitle?: string;
  href: string;
};

export const EVENT_TYPE_LABEL: Record<CalendarEventType, string> = {
  task: "משימה",
  delivery: "אספקה",
  payment: "תשלום",
  decision: "החלטה",
};
