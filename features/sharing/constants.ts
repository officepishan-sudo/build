import type { ShareLevel } from "@prisma/client";

// רמות הניתנות להקצאה דרך מסך השיתוף. OWNER אינה ברשימה בכוונה - היא לא ProjectShare,
// היא Project.ownerId, ואי אפשר להעניק/לשלול אותה מכאן (סעיף 14, edge case קריטי).
export const ASSIGNABLE_SHARE_LEVELS = ["VIEW", "COMMENT", "DECIDE", "MANAGE"] as const;
export type AssignableShareLevel = (typeof ASSIGNABLE_SHARE_LEVELS)[number];

export const SHARE_LEVEL_LABEL: Record<ShareLevel, string> = {
  VIEW: "צפייה",
  COMMENT: "תגובה",
  DECIDE: "השתתפות בהחלטות",
  MANAGE: "ניהול תפעולי",
  OWNER: "בעלים",
};

export const SHARE_LEVEL_DESCRIPTION: Record<ShareLevel, string> = {
  VIEW: "רואה את המידע שהוקצה לו בפרויקט, בלי יכולת להגיב או לשנות.",
  COMMENT: "כמו צפייה, ובנוסף יכול להגיב ולהוסיף תוכן (הודעות, מסמכים, תמונות).",
  DECIDE: "כמו תגובה, ובנוסף משתתף בהכרעות בהחלטות שהוקצו אליו.",
  MANAGE: "ניהול תפעולי של תחום בפרויקט (למשל תקציב או לוח זמנים) - כולל עריכה בתחום הזה.",
  OWNER: "גישה מלאה לכל הפרויקט, כולל ניהול שיתוף והרשאות. לא ניתן להעניק דרך מסך זה.",
};
