import { describe, expect, it } from "vitest";
import { canDeleteDraft, canTransition, isEditable, isTerminal } from "./transitions";

describe("canTransition", () => {
  it("מאפשרת את מסלול המחזור המלא", () => {
    expect(canTransition("DRAFT", "CLARIFICATION")).toBe(true);
    expect(canTransition("CLARIFICATION", "PROPOSED")).toBe(true);
    expect(canTransition("PROPOSED", "APPROVAL")).toBe(true);
    expect(canTransition("APPROVAL", "APPROVED")).toBe(true);
    expect(canTransition("APPROVED", "DONE")).toBe(true);
  });

  it("מאפשרת CANCELLED מכל שלב לפני DONE", () => {
    expect(canTransition("DRAFT", "CANCELLED")).toBe(true);
    expect(canTransition("CLARIFICATION", "CANCELLED")).toBe(true);
    expect(canTransition("PROPOSED", "CANCELLED")).toBe(true);
    expect(canTransition("APPROVAL", "CANCELLED")).toBe(true);
  });

  it("לא מאפשרת ביטול אחרי DONE", () => {
    expect(canTransition("DONE", "CANCELLED")).toBe(false);
  });

  it("לא מאפשרת קפיצה ישירה מ-DRAFT ל-APPROVAL (מדלגת על הבהרה/הצעה)", () => {
    expect(canTransition("DRAFT", "APPROVAL")).toBe(false);
  });

  it("מאפשרת חזרה מ-PROPOSED ל-CLARIFICATION - שינוי לא ברור לא נדחף קדימה בכוח", () => {
    expect(canTransition("PROPOSED", "CLARIFICATION")).toBe(true);
  });

  it("לא מאפשרת שום מעבר מסטטוסים סופיים", () => {
    expect(canTransition("REJECTED", "APPROVED")).toBe(false);
    expect(canTransition("DONE", "APPROVED")).toBe(false);
    expect(canTransition("CANCELLED", "DRAFT")).toBe(false);
  });
});

describe("isTerminal", () => {
  it("מזהה DONE/REJECTED/CANCELLED כסופיים", () => {
    expect(isTerminal("DONE")).toBe(true);
    expect(isTerminal("REJECTED")).toBe(true);
    expect(isTerminal("CANCELLED")).toBe(true);
  });

  it("לא מזהה שלבים באמצע המחזור כסופיים", () => {
    expect(isTerminal("DRAFT")).toBe(false);
    expect(isTerminal("APPROVAL")).toBe(false);
  });
});

describe("canDeleteDraft / isEditable", () => {
  it("מאפשרת מחיקה רק ל-DRAFT - 'לא מוחקים עבר'", () => {
    expect(canDeleteDraft("DRAFT")).toBe(true);
    expect(canDeleteDraft("CLARIFICATION")).toBe(false);
    expect(canDeleteDraft("APPROVED")).toBe(false);
  });

  it("לא ניתן לערוך שינוי שכבר הוכרע", () => {
    expect(isEditable("APPROVAL")).toBe(true);
    expect(isEditable("APPROVED")).toBe(false);
    expect(isEditable("REJECTED")).toBe(false);
    expect(isEditable("DONE")).toBe(false);
  });
});
