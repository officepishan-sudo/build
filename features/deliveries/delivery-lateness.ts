// חישוב טהור: אספקה "מאוחרת" - תאריך צפוי בעבר וסטטוס שלא הושלם/בוטל (P22 edge case).

const CLOSED_STATUSES = new Set(["RECEIVED", "CANCELLED"]);

export function isDeliveryLate(
  delivery: { expectedDate: Date | null; status: string },
  now: Date = new Date(),
): boolean {
  if (!delivery.expectedDate) return false;
  if (CLOSED_STATUSES.has(delivery.status)) return false;
  return delivery.expectedDate.getTime() < now.getTime();
}
