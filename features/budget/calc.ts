// חישובי תקציב טהורים - בלי DB, בלי בקשה. נבדקים ב-calc.test.ts.
// עקרון מחייב (ספק 8.2): מתוכנן / התחייבויות / בפועל / שולם הם ארבעה מספרים
// נפרדים שלעולם לא מתמזגים לאחד. הפונקציות כאן מחשבות מה שנגזר מהם
// (נותר / פער / תחזית) בלי לטשטש את המקור.

export type BudgetAmounts = {
  planned: number;
  committed: number;
  actual: number;
  paid: number;
};

/** נותר להוצאה מול התכנון: מתוכנן פחות בפועל (לא פחות התחייבויות - זה מספר אחר). */
export function computeRemaining(amounts: BudgetAmounts): number {
  return amounts.planned - amounts.actual;
}

/** פער: חיובי = חריגה מהתכנון, שלילי = מתחת לתכנון. */
export function computeVariance(amounts: BudgetAmounts): number {
  return amounts.actual - amounts.planned;
}

/**
 * תחזית פשוטה, מתויגת כהערכה בלבד: הגבוה מבין מתוכנן/בפועל/התחייבויות.
 * ההיגיון: אם כבר הוצאנו או התחייבנו מעבר לתכנון, סביר שזה יהיה העלות
 * הסופית לפחות; אם לא - אין סיבה טובה יותר מהתכנון המקורי.
 */
export function computeForecast(amounts: BudgetAmounts): number {
  return Math.max(amounts.planned, amounts.actual, amounts.committed);
}

/** בפועל = סכום ה-Expense המקושרים לשורה, נספר בזמן קריאה ולא כשדה נשמר. */
export function sumExpenseAmounts(expenses: { amount: number }[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

/**
 * שולם = סכום תשלומים בסטטוס PAID בלבד. תשלום PARTIAL לא נספר במדויק כי
 * אין בסכימה שדה לסכום ששולם בפועל מתוך תשלום חלקי (ראו דוח פערי סכימה) -
 * הוא מסומן בנפרד כ"דורש בדיקה" במקום להיספר בטעות כמלא או כאפס.
 */
export function sumPaidAmounts(payments: { amount: number; status: string }[]): number {
  return payments.filter((p) => p.status === "PAID").reduce((sum, p) => sum + p.amount, 0);
}

export function hasUnquantifiedPartialPayment(payments: { status: string }[]): boolean {
  return payments.some((p) => p.status === "PARTIAL");
}

/** חריגה לא מוסברת: פער חיובי בלי varianceReason - לא מוצג כשקט, תמיד מסומן. */
export function hasUnexplainedOverage(amounts: BudgetAmounts, varianceReason: string | null | undefined): boolean {
  return computeVariance(amounts) > 0 && !varianceReason;
}

export type BudgetLineSummary = BudgetAmounts & {
  id: string;
  category: string;
  varianceReason: string | null;
  remaining: number;
  variance: number;
  forecast: number;
  isOverageUnexplained: boolean;
  hasActualYet: boolean;
  hasUnquantifiedPartial: boolean;
  expenseCount: number;
};

export type RawBudgetLine = {
  id: string;
  category: string;
  varianceReason: string | null;
  planned: number;
  committed: number;
  expenses: { amount: number }[];
  payments: { amount: number; status: string }[];
};

/** בונה DTO מלא לשורת תקציב מנתונים גולמיים (כבר מומרים ל-number). */
export function buildBudgetLineSummary(line: RawBudgetLine): BudgetLineSummary {
  const actual = sumExpenseAmounts(line.expenses);
  const paid = sumPaidAmounts(line.payments);
  const amounts: BudgetAmounts = { planned: line.planned, committed: line.committed, actual, paid };

  return {
    ...amounts,
    id: line.id,
    category: line.category,
    varianceReason: line.varianceReason,
    remaining: computeRemaining(amounts),
    variance: computeVariance(amounts),
    forecast: computeForecast(amounts),
    isOverageUnexplained: hasUnexplainedOverage(amounts, line.varianceReason),
    hasActualYet: actual > 0,
    hasUnquantifiedPartial: hasUnquantifiedPartialPayment(line.payments),
    expenseCount: line.expenses.length,
  };
}

export type BadgeTone = "neutral" | "success" | "warning" | "info" | "danger";

/** גוון תצוגה לפער - חריגה=אדום, מתחת לתכנון=ירוק, בדיוק לפי התכנון=ניטרלי. */
export function varianceTone(variance: number): BadgeTone {
  if (variance > 0) return "danger";
  if (variance < 0) return "success";
  return "neutral";
}

export function computeBudgetTotals(lines: BudgetAmounts[]): BudgetAmounts {
  return lines.reduce(
    (acc, l) => ({
      planned: acc.planned + l.planned,
      committed: acc.committed + l.committed,
      actual: acc.actual + l.actual,
      paid: acc.paid + l.paid,
    }),
    { planned: 0, committed: 0, actual: 0, paid: 0 },
  );
}
