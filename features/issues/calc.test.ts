import { describe, expect, it } from "vitest";
import { appendResolutionNote } from "./calc";

describe("appendResolutionNote", () => {
  const at = new Date("2026-09-17T10:00:00Z");

  it("יוצרת הערה חדשה כשאין impact קודם", () => {
    const result = appendResolutionNote(null, "נפתר", "תוקן ע\"י האינסטלטור", at);
    expect(result).toBe('[נפתר - 2026-09-17]: תוקן ע"י האינסטלטור');
  });

  it("מוסיפה להערה הקיימת בלי למחוק אותה", () => {
    const result = appendResolutionNote("השפעה: עיכוב בשלב הריצוף", "נסגר", "אושר ע\"י המפקח", at);
    expect(result).toContain("השפעה: עיכוב בשלב הריצוף");
    expect(result).toContain('[נסגר - 2026-09-17]: אושר ע"י המפקח');
  });

  it("מתייחסת ל-impact ריק (מחרוזת רווחים) כאילו אין impact קודם", () => {
    const result = appendResolutionNote("   ", "נפתר", "טופל", at);
    expect(result).toBe("[נפתר - 2026-09-17]: טופל");
  });
});
