import { describe, expect, it } from "vitest";
import {
  buildBudgetLineSummary,
  computeBudgetTotals,
  computeForecast,
  computeRemaining,
  computeVariance,
  hasUnexplainedOverage,
  hasUnquantifiedPartialPayment,
  sumExpenseAmounts,
  sumPaidAmounts,
  varianceTone,
} from "./calc";

describe("computeRemaining", () => {
  it("מחשבת מתוכנן פחות בפועל, לא פחות התחייבויות", () => {
    expect(computeRemaining({ planned: 1000, committed: 900, actual: 400, paid: 200 })).toBe(600);
  });
});

describe("computeVariance", () => {
  it("מחזירה ערך חיובי כשיש חריגה מהתכנון", () => {
    expect(computeVariance({ planned: 1000, committed: 0, actual: 1200, paid: 0 })).toBe(200);
  });

  it("מחזירה ערך שלילי כשההוצאה מתחת לתכנון", () => {
    expect(computeVariance({ planned: 1000, committed: 0, actual: 800, paid: 0 })).toBe(-200);
  });
});

describe("computeForecast", () => {
  it("כשאין עדיין בפועל ואין התחייבות - התחזית היא המתוכנן, ומתויגת כהערכה", () => {
    expect(computeForecast({ planned: 1000, committed: 0, actual: 0, paid: 0 })).toBe(1000);
  });

  it("כשיש חריגה בפועל מעל התכנון - התחזית עוקבת אחרי הבפועל", () => {
    expect(computeForecast({ planned: 1000, committed: 0, actual: 1300, paid: 0 })).toBe(1300);
  });

  it("כשיש התחייבות גבוהה מהתכנון אך עדיין אין בפועל - התחזית לוקחת את ההתחייבות", () => {
    expect(computeForecast({ planned: 1000, committed: 1400, actual: 0, paid: 0 })).toBe(1400);
  });
});

describe("sumExpenseAmounts / sumPaidAmounts", () => {
  it("מסכמת את כל ההוצאות המקושרות", () => {
    expect(sumExpenseAmounts([{ amount: 100 }, { amount: 250 }])).toBe(350);
  });

  it("מסכמת רק תשלומים בסטטוס PAID", () => {
    const payments = [
      { amount: 100, status: "PAID" },
      { amount: 50, status: "PENDING" },
      { amount: 30, status: "PARTIAL" },
    ];
    expect(sumPaidAmounts(payments)).toBe(100);
  });

  it("מזהה תשלום PARTIAL כדורש בדיקה, לא נספר כמלא ולא כאפס", () => {
    expect(hasUnquantifiedPartialPayment([{ status: "PARTIAL" }])).toBe(true);
    expect(hasUnquantifiedPartialPayment([{ status: "PAID" }])).toBe(false);
  });
});

describe("hasUnexplainedOverage", () => {
  it("מסמנת חריגה בלי varianceReason", () => {
    expect(hasUnexplainedOverage({ planned: 100, committed: 0, actual: 150, paid: 0 }, null)).toBe(true);
  });

  it("לא מסמנת כשיש הסבר לפער", () => {
    expect(hasUnexplainedOverage({ planned: 100, committed: 0, actual: 150, paid: 0 }, "עליית מחירי חומרי גלם")).toBe(
      false,
    );
  });

  it("לא מסמנת כשאין בכלל חריגה", () => {
    expect(hasUnexplainedOverage({ planned: 100, committed: 0, actual: 80, paid: 0 }, null)).toBe(false);
  });
});

describe("buildBudgetLineSummary", () => {
  it("מחשבת actual כסכום Expense-ים בזמן קריאה, לא כשדה שמור", () => {
    const summary = buildBudgetLineSummary({
      id: "l1",
      category: "אינסטלציה",
      varianceReason: null,
      planned: 1000,
      committed: 0,
      expenses: [{ amount: 300 }, { amount: 200 }],
      payments: [],
    });

    expect(summary.actual).toBe(500);
    expect(summary.remaining).toBe(500);
    expect(summary.hasActualYet).toBe(true);
    expect(summary.expenseCount).toBe(2);
  });

  it("מוסיפים הוצאה חדשה - הסכום מתעדכן מיד כי הוא נגזר, לא נשמר", () => {
    const before = buildBudgetLineSummary({
      id: "l1",
      category: "חשמל",
      varianceReason: null,
      planned: 1000,
      committed: 0,
      expenses: [{ amount: 300 }],
      payments: [],
    });
    const after = buildBudgetLineSummary({
      id: "l1",
      category: "חשמל",
      varianceReason: null,
      planned: 1000,
      committed: 0,
      expenses: [{ amount: 300 }, { amount: 450 }],
      payments: [],
    });

    expect(before.actual).toBe(300);
    expect(after.actual).toBe(750);
  });

  it("שורה בלי בפועל עדיין מוצגת כ'מתוכנן בלבד' (hasActualYet=false)", () => {
    const summary = buildBudgetLineSummary({
      id: "l2",
      category: "גינון",
      varianceReason: null,
      planned: 500,
      committed: 0,
      expenses: [],
      payments: [],
    });

    expect(summary.hasActualYet).toBe(false);
    expect(summary.actual).toBe(0);
    expect(summary.isOverageUnexplained).toBe(false);
  });
});

describe("varianceTone", () => {
  it("מחזירה danger כשיש חריגה, success כשמתחת לתכנון, neutral כשמדויק", () => {
    expect(varianceTone(50)).toBe("danger");
    expect(varianceTone(-50)).toBe("success");
    expect(varianceTone(0)).toBe("neutral");
  });
});

describe("computeBudgetTotals", () => {
  it("מסכמת את כל המרכיבים על פני כמה שורות", () => {
    const totals = computeBudgetTotals([
      { planned: 100, committed: 50, actual: 80, paid: 40 },
      { planned: 200, committed: 0, actual: 300, paid: 100 },
    ]);
    expect(totals).toEqual({ planned: 300, committed: 50, actual: 380, paid: 140 });
  });

  it("מחזירה אפסים על מערך ריק", () => {
    expect(computeBudgetTotals([])).toEqual({ planned: 0, committed: 0, actual: 0, paid: 0 });
  });
});
