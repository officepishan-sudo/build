import type { ChangeStatus } from "@prisma/client";

// מחזור החיים המחייב (ספק P28): DRAFT→CLARIFICATION→PROPOSED→APPROVAL→
// APPROVED/REJECTED→DONE, או CANCELLED בכל שלב לפני DONE. "לא מוחקים עבר" -
// אין מעבר חזרה מ-APPROVED/REJECTED/DONE/CANCELLED.
const ALLOWED_TRANSITIONS: Record<ChangeStatus, ChangeStatus[]> = {
  DRAFT: ["CLARIFICATION", "PROPOSED", "CANCELLED"],
  CLARIFICATION: ["PROPOSED", "CANCELLED"],
  PROPOSED: ["CLARIFICATION", "APPROVAL", "CANCELLED"],
  APPROVAL: ["APPROVED", "REJECTED", "CANCELLED"],
  APPROVED: ["DONE"],
  REJECTED: [],
  DONE: [],
  CANCELLED: [],
};

export function canTransition(from: ChangeStatus, to: ChangeStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function isTerminal(status: ChangeStatus): boolean {
  return ALLOWED_TRANSITIONS[status].length === 0;
}

/** רק DRAFT ניתן למחיקה - שום דבר לא היה תלוי בו עדיין. */
export function canDeleteDraft(status: ChangeStatus): boolean {
  return status === "DRAFT";
}

/** סטטוסים שבהם עוד מותר לערוך את פרטי השינוי (לפני שהוכרע). */
const EDITABLE_STATUSES: ChangeStatus[] = ["DRAFT", "CLARIFICATION", "PROPOSED", "APPROVAL"];

export function isEditable(status: ChangeStatus): boolean {
  return EDITABLE_STATUSES.includes(status);
}
