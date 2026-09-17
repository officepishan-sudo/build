import { describe, expect, it } from "vitest";
import { calculateGapVsEstimate, sumEstimateLines } from "./gap-calculation";

describe("sumEstimateLines", () => {
  it("מחזירה null כשאין שורות אומדן בכלל (לא 0)", () => {
    expect(sumEstimateLines([])).toBeNull();
  });

  it("משתמשת ב-totalCost כשהוא קיים", () => {
    const total = sumEstimateLines([{ totalCost: 500, materialCost: 100, laborCost: 100, transportCost: 100 }]);
    expect(total).toBe(500);
  });

  it("מחשבת חומר+עבודה+הובלה כשאין totalCost", () => {
    const total = sumEstimateLines([{ totalCost: null, materialCost: 200, laborCost: 300, transportCost: 50 }]);
    expect(total).toBe(550);
  });

  it("מתייחסת לשדה חסר כ-0 בחישוב הפולבק", () => {
    const total = sumEstimateLines([{ totalCost: null, materialCost: 200, laborCost: null, transportCost: null }]);
    expect(total).toBe(200);
  });

  it("מסכמת כמה שורות מעורבות (עם ובלי totalCost)", () => {
    const total = sumEstimateLines([
      { totalCost: 500, materialCost: null, laborCost: null, transportCost: null },
      { totalCost: null, materialCost: 100, laborCost: 50, transportCost: 0 },
    ]);
    expect(total).toBe(650);
  });
});

describe("calculateGapVsEstimate", () => {
  it("מחזירה null כשאין אומדן להשוואה", () => {
    expect(calculateGapVsEstimate(1000, null)).toBeNull();
  });

  it("מחזירה פער חיובי כשההצעה יקרה מהאומדן", () => {
    expect(calculateGapVsEstimate(1200, 1000)).toBe(200);
  });

  it("מחזירה פער שלילי כשההצעה זולה מהאומדן", () => {
    expect(calculateGapVsEstimate(800, 1000)).toBe(-200);
  });

  it("מחזירה 0 כשההצעה תואמת בדיוק לאומדן", () => {
    expect(calculateGapVsEstimate(1000, 1000)).toBe(0);
  });
});
