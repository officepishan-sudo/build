import { describe, expect, it } from "vitest";
import { appendDefectNote } from "./calc";

describe("appendDefectNote", () => {
  const at = new Date("2026-09-17T10:00:00Z");

  it("יוצרת הערה חדשה כשאין resolutionNotes קודם", () => {
    expect(appendDefectNote(null, "תוקן", "הוחלף האריח הסדוק", at)).toBe("[תוקן - 2026-09-17]: הוחלף האריח הסדוק");
  });

  it("מוסיפה הערת סגירה בלי למחוק את הערת התיקון", () => {
    const afterFix = appendDefectNote(null, "תוקן", "הוחלף האריח", at);
    const afterClose = appendDefectNote(afterFix, "אושרה סגירה", "נבדק ואושר ע\"י המפקח", at);
    expect(afterClose).toContain("הוחלף האריח");
    expect(afterClose).toContain('[אושרה סגירה - 2026-09-17]: נבדק ואושר ע"י המפקח');
  });
});
