import { describe, expect, it } from "vitest";
import { findInvalidCartLines, generateOrderNumber, groupCartLinesIntoOrders, type CartLineForOrder } from "./order-calc";

function line(overrides: Partial<CartLineForOrder> = {}): CartLineForOrder {
  return {
    id: "cart-1",
    description: "חול בניין",
    quantity: 5,
    unitPrice: 10,
    supplierId: "supplier-1",
    phaseId: null,
    ...overrides,
  };
}

describe("findInvalidCartLines", () => {
  it("מסמנת שורה בלי ספק כלא תקינה", () => {
    const invalid = findInvalidCartLines([line({ supplierId: null })]);
    expect(invalid).toHaveLength(1);
  });

  it("מסמנת שורה עם כמות אפס/שלילית כלא תקינה", () => {
    expect(findInvalidCartLines([line({ quantity: 0 })])).toHaveLength(1);
    expect(findInvalidCartLines([line({ quantity: -2 })])).toHaveLength(1);
  });

  it("שורה עם ספק וכמות תקינה עוברת", () => {
    expect(findInvalidCartLines([line()])).toHaveLength(0);
  });
});

describe("groupCartLinesIntoOrders", () => {
  it("מקבצת שורות לפי ספק - הזמנה אחת לכל ספק", () => {
    const lines = [
      line({ id: "1", supplierId: "s1", quantity: 2, unitPrice: 10 }),
      line({ id: "2", supplierId: "s1", quantity: 3, unitPrice: 20 }),
      line({ id: "3", supplierId: "s2", quantity: 1, unitPrice: 100 }),
    ];

    const groups = groupCartLinesIntoOrders(lines);

    expect(groups).toHaveLength(2);
    const s1 = groups.find((g) => g.supplierId === "s1")!;
    expect(s1.lines).toHaveLength(2);
    expect(s1.totalAmount).toBe(2 * 10 + 3 * 20);
    expect(s1.sourceCartItemIds).toEqual(["1", "2"]);
  });

  it("שורה בלי מחיר יחידה מטופלת כאפס בסך ההזמנה", () => {
    const groups = groupCartLinesIntoOrders([line({ unitPrice: null, quantity: 4 })]);
    expect(groups[0]?.totalAmount).toBe(0);
  });

  it("לוקחת את השלב הראשון בקבוצה שיש לו שלב", () => {
    const groups = groupCartLinesIntoOrders([
      line({ id: "1", phaseId: null }),
      line({ id: "2", phaseId: "phase-9" }),
    ]);
    expect(groups[0]?.phaseId).toBe("phase-9");
  });
});

describe("generateOrderNumber", () => {
  it("מייצרת מספר הזמנה קריא ומתחיל ב-ORD-", () => {
    const number = generateOrderNumber(new Date("2026-09-17T10:00:00Z"), 0);
    expect(number).toMatch(/^ORD-\d{14}-1$/);
  });

  it("אינדקס שונה בתוך אותה בקשה מייצר מספר שונה", () => {
    const now = new Date("2026-09-17T10:00:00Z");
    expect(generateOrderNumber(now, 0)).not.toBe(generateOrderNumber(now, 1));
  });
});
