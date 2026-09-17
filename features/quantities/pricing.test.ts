import { describe, expect, it } from "vitest";
import { computeGrandTotal, computeLineTotal } from "./pricing";

describe("computeLineTotal", () => {
  it("מסכם את שלושת מרכיבי העלות", () => {
    expect(computeLineTotal({ materialCost: 100, laborCost: 50, transportCost: 20 })).toBe(170);
  });

  it("מתעלמת ממרכיבים חסרים ומחשבת רק את מה שיש", () => {
    expect(computeLineTotal({ materialCost: 100 })).toBe(100);
  });

  it("מחזירה null כשאין אף מרכיב ידוע - זו שורה 'דורש בדיקה', לא 0", () => {
    expect(computeLineTotal({})).toBeNull();
  });

  it("מכבדת דריסה ידנית (totalCostOverride) גם כשיש מרכיבים אחרים", () => {
    expect(computeLineTotal({ materialCost: 100, laborCost: 50, totalCostOverride: 999 })).toBe(999);
  });

  it("מתייחסת ל-0 כערך ידוע (לא כ'חסר')", () => {
    expect(computeLineTotal({ materialCost: 0, laborCost: 0 })).toBe(0);
  });
});

describe("computeGrandTotal", () => {
  it("מסכמת שורות עם totalCost בלבד ומדלגת על null", () => {
    const lines = [{ totalCost: 100 }, { totalCost: null }, { totalCost: 50 }];
    expect(computeGrandTotal(lines)).toBe(150);
  });

  it("מחזירה 0 כשאין שורות", () => {
    expect(computeGrandTotal([])).toBe(0);
  });
});
