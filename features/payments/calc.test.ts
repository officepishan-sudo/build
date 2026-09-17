import { describe, expect, it } from "vitest";
import { isPaymentOverdue, resolveSubjectLabel } from "./calc";

describe("resolveSubjectLabel", () => {
  it("מחזירה את המועמד הראשון שאינו ריק", () => {
    expect(resolveSubjectLabel([null, "הזמנה מס' 5", "הצעת מחיר"])).toBe("הזמנה מס' 5");
  });

  it("מדלגת על מחרוזות ריקות/רווחים בלבד", () => {
    expect(resolveSubjectLabel(["  ", undefined, "תיאור הוצאה"])).toBe("תיאור הוצאה");
  });

  it("מחזירה מקף כשאין שום מועמד - לא ממציאה טקסט", () => {
    expect(resolveSubjectLabel([null, undefined])).toBe("—");
  });
});

describe("isPaymentOverdue", () => {
  const now = new Date("2026-09-17T00:00:00Z");

  it("מזהה תשלום ממתין שעבר את המועד", () => {
    expect(isPaymentOverdue({ status: "PENDING", dueDate: new Date("2026-09-01") }, now)).toBe(true);
  });

  it("לא מזהה כחורג תשלום ששולם במלואו גם אם המועד עבר", () => {
    expect(isPaymentOverdue({ status: "PAID", dueDate: new Date("2026-09-01") }, now)).toBe(false);
  });

  it("לא מזהה כחורג תשלום בלי מועד יעד", () => {
    expect(isPaymentOverdue({ status: "PENDING", dueDate: null }, now)).toBe(false);
  });

  it("מזהה תשלום חלקי שעבר את המועד כחורג", () => {
    expect(isPaymentOverdue({ status: "PARTIAL", dueDate: new Date("2026-09-01") }, now)).toBe(true);
  });

  it("לא מזהה כחורג תשלום שהמועד שלו עוד לא הגיע", () => {
    expect(isPaymentOverdue({ status: "PENDING", dueDate: new Date("2026-10-01") }, now)).toBe(false);
  });
});
