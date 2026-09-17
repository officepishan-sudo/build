// חישובי עלות טהורים לכתב הכמויות - בלי DB, בלי בקשה. נבדקים ב-pricing.test.ts.

type CostParts = {
  materialCost?: number | null;
  laborCost?: number | null;
  transportCost?: number | null;
  totalCostOverride?: number | null;
};

/**
 * מחשב את סה"כ העלות לשורה: סכום שלושת המרכיבים, אלא אם נמסרה דריסה ידנית
 * (totalCostOverride) - למשל כשהמשתמש קיבל מחיר כולל מהספק בלי פירוט.
 */
export function computeLineTotal({ materialCost, laborCost, transportCost, totalCostOverride }: CostParts): number | null {
  if (totalCostOverride !== undefined && totalCostOverride !== null) {
    return totalCostOverride;
  }
  const parts = [materialCost, laborCost, transportCost].filter((n): n is number => n !== undefined && n !== null);
  if (parts.length === 0) return null;
  return parts.reduce((sum, n) => sum + n, 0);
}

/** סכום כל השורות עם totalCost ידוע (שורות null/undefined לא נספרות - הן "דורש בדיקה"). */
export function computeGrandTotal(lines: { totalCost: number | null | undefined }[]): number {
  return lines.reduce((sum, line) => sum + (line.totalCost ?? 0), 0);
}
