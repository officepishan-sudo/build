// חישובים טהורים למסך תשלומים. תשלום ≠ הוצאה - הפונקציות כאן לעולם לא
// נוגעות ב-Expense, רק מציגות/מסמנות את מה שכבר קיים ב-Payment.

/** "על מה" - הראשון שקיים מבין המועמדים, אחרת "—" (לא מסתירים חוסר מידע). */
export function resolveSubjectLabel(candidates: (string | null | undefined)[]): string {
  return candidates.find((c) => c && c.trim().length > 0) ?? "—";
}

export type PaymentForOverdueCheck = { status: string; dueDate: Date | null };

/** תשלום שעבר את המועד ועדיין לא שולם/שולם רק חלקית. */
export function isPaymentOverdue(payment: PaymentForOverdueCheck, now: Date = new Date()): boolean {
  if (!payment.dueDate) return false;
  if (payment.status !== "PENDING" && payment.status !== "PARTIAL") return false;
  return payment.dueDate.getTime() < now.getTime();
}
