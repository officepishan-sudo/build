// חישוב טהור של תוקף אחריות - בלי DB, בלי בקשה. נבדק ב-warranty-status.test.ts.

export type WarrantyStatus = "ACTIVE" | "EXPIRING_SOON" | "EXPIRED";

const EXPIRING_SOON_DAYS = 30;

/** תאריך תפוגה = startDate + durationMonths (חודשים קלנדריים, כולל גלישת סוף חודש). */
export function computeExpiryDate(startDate: Date, durationMonths: number): Date {
  const expiry = new Date(startDate.getTime());
  expiry.setMonth(expiry.getMonth() + durationMonths);
  return expiry;
}

/**
 * מסווגת אחריות ל: פגה (EXPIRED) / עומדת לפוג בקרוב (EXPIRING_SOON, עד 30 יום) / בתוקף (ACTIVE).
 * `now` ניתן כפרמטר כדי שהפונקציה תישאר טהורה וניתנת לבדיקה דטרמיניסטית.
 */
export function computeWarrantyStatus(
  startDate: Date,
  durationMonths: number,
  now: Date = new Date(),
): { expiryDate: Date; status: WarrantyStatus; daysUntilExpiry: number } {
  const expiryDate = computeExpiryDate(startDate, durationMonths);
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) return { expiryDate, status: "EXPIRED", daysUntilExpiry };
  if (daysUntilExpiry <= EXPIRING_SOON_DAYS) return { expiryDate, status: "EXPIRING_SOON", daysUntilExpiry };
  return { expiryDate, status: "ACTIVE", daysUntilExpiry };
}
