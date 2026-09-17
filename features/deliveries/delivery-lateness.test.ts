import { describe, expect, it } from "vitest";
import { isDeliveryLate } from "./delivery-lateness";

const NOW = new Date("2026-09-17T12:00:00Z");

describe("isDeliveryLate", () => {
  it("לא מאוחרת כשאין תאריך צפוי (לא ממציאים תאריך)", () => {
    expect(isDeliveryLate({ expectedDate: null, status: "SCHEDULED" }, NOW)).toBe(false);
  });

  it("מאוחרת כשהתאריך הצפוי עבר והסטטוס לא סופי", () => {
    const yesterday = new Date("2026-09-16T00:00:00Z");
    expect(isDeliveryLate({ expectedDate: yesterday, status: "SCHEDULED" }, NOW)).toBe(true);
    expect(isDeliveryLate({ expectedDate: yesterday, status: "IN_TRANSIT" }, NOW)).toBe(true);
  });

  it("לא מאוחרת כשכבר התקבלה, גם אם התאריך הצפוי עבר", () => {
    const yesterday = new Date("2026-09-16T00:00:00Z");
    expect(isDeliveryLate({ expectedDate: yesterday, status: "RECEIVED" }, NOW)).toBe(false);
  });

  it("לא מאוחרת כשבוטלה", () => {
    const yesterday = new Date("2026-09-16T00:00:00Z");
    expect(isDeliveryLate({ expectedDate: yesterday, status: "CANCELLED" }, NOW)).toBe(false);
  });

  it("לא מאוחרת כשהתאריך הצפוי עדיין בעתיד", () => {
    const tomorrow = new Date("2026-09-18T00:00:00Z");
    expect(isDeliveryLate({ expectedDate: tomorrow, status: "SCHEDULED" }, NOW)).toBe(false);
  });
});
