import { describe, expect, it } from "vitest";
import { computeExpiryDate, computeWarrantyStatus } from "./warranty-status";

describe("computeExpiryDate", () => {
  it("מוסיפה חודשים קלנדריים לתאריך ההתחלה", () => {
    const expiry = computeExpiryDate(new Date("2026-01-15T00:00:00Z"), 12);
    expect(expiry.getUTCFullYear()).toBe(2027);
    expect(expiry.getUTCMonth()).toBe(0); // ינואר
  });

  it("מטפלת נכון בגלישת סוף חודש (31 בינואר + חודש)", () => {
    const expiry = computeExpiryDate(new Date("2026-01-31T00:00:00Z"), 1);
    // JS גולש למרץ כי בפברואר אין 31 - זו התנהגות סטנדרטית של Date, לא באג כאן
    expect(expiry.getUTCMonth()).toBe(2);
  });
});

describe("computeWarrantyStatus", () => {
  const now = new Date("2026-06-01T00:00:00Z");

  it("מסמנת אחריות רחוקה כ-ACTIVE", () => {
    const result = computeWarrantyStatus(new Date("2026-01-01T00:00:00Z"), 24, now);
    expect(result.status).toBe("ACTIVE");
  });

  it("מסמנת אחריות שעומדת לפוג תוך 30 יום כ-EXPIRING_SOON", () => {
    // מתחילה ב-1.1.2026 ל-5 חודשים -> פוגה ב-1.6.2026, אותו יום כמו now -> 0 ימים, EXPIRING_SOON
    const result = computeWarrantyStatus(new Date("2026-01-01T00:00:00Z"), 5, now);
    expect(result.status).toBe("EXPIRING_SOON");
  });

  it("גבול מדויק: יום 30 בדיוק הוא עדיין EXPIRING_SOON, יום 31 כבר ACTIVE", () => {
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const in31Days = new Date(now.getTime() + 31 * 24 * 60 * 60 * 1000);

    expect(computeWarrantyStatus(subtractMonths(in30Days, 1), 1, now).status).toBe("EXPIRING_SOON");
    expect(computeWarrantyStatus(subtractMonths(in31Days, 1), 1, now).status).toBe("ACTIVE");
  });

  it("מסמנת אחריות שכבר עברה כ-EXPIRED", () => {
    const result = computeWarrantyStatus(new Date("2020-01-01T00:00:00Z"), 12, now);
    expect(result.status).toBe("EXPIRED");
    expect(result.daysUntilExpiry).toBeLessThan(0);
  });
});

function subtractMonths(date: Date, months: number): Date {
  const d = new Date(date.getTime());
  d.setMonth(d.getMonth() - months);
  return d;
}
