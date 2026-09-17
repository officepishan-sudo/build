import type { DashboardData } from "./dashboard-types";

export type RecommendedAction = { label: string; description: string; href: string };

// "3-5 פעולות מומלצות הבאות" (P11) - לוגיקת עדיפות פשוטה וקריאה, לא AI: פרויקט חדש
// מקבל צעדי onboarding; פרויקט פעיל מקבל הפניה למה שדורש תשומת לב עכשיו (החלטות/בעיות/שינויים),
// עם נפילה חזרה (fallback) לפעולות מעקב שוטפות אם אין דבר דחוף.
export function getRecommendedActions(projectId: string, data: DashboardData): RecommendedAction[] {
  const base = `/projects/${projectId}`;
  const actions: RecommendedAction[] = [];

  if (data.isNewProject) {
    actions.push(
      { label: "מילוי שאלון הפרויקט", description: "כמה שאלות שיעזרו לבנות תוכנית מדויקת", href: `${base}/questionnaire` },
      { label: "בניית כתב כמויות ראשוני", description: "רשימת הפריטים והכמויות הנדרשות", href: `${base}/quantities` },
      { label: "שליחת בקשות להצעות מחיר", description: "פנייה לבעלי מקצוע וספקים רלוונטיים", href: `${base}/quote-requests` },
    );
  }

  if (data.openDecisions.status === "ok" && data.openDecisions.data.count > 0) {
    actions.push({
      label: `הכרעה ב-${data.openDecisions.data.count} החלטות פתוחות`,
      description: "החלטות שממתינות לכם - חלקן עם דדליין קרוב",
      href: `${base}/decisions`,
    });
  }

  if (!data.isNewProject && data.budget.status === "ok" && data.budget.data.lineCount === 0) {
    actions.push({ label: "הגדרת תקציב ראשוני", description: "פירוט צפי ההוצאות לפי קטגוריה", href: `${base}/budget` });
  }

  if (data.issues.status === "ok" && data.issues.data.count > 0) {
    actions.push({
      label: `טיפול ב-${data.issues.data.count} בעיות פתוחות`,
      description: "בעיות שדורשות מעקב או פתרון",
      href: `${base}/issues`,
    });
  }

  if (data.changeRequests.status === "ok" && data.changeRequests.data.count > 0) {
    actions.push({
      label: `בדיקת ${data.changeRequests.data.count} בקשות שינוי`,
      description: "שינויים שממתינים להכרעה או אישור",
      href: `${base}/changes`,
    });
  }

  if (!data.isNewProject && data.schedule.status === "ok" && data.schedule.data.length === 0) {
    actions.push({ label: "בניית לוח זמנים", description: "הגדירו שלבים ותאריכים ללוח הזמנים", href: `${base}/schedule` });
  }

  fillWithFallbacks(actions, base);
  return actions.slice(0, 5);
}

function fillWithFallbacks(actions: RecommendedAction[], base: string) {
  const fallbacks: RecommendedAction[] = [
    { label: "סקירת תקציב מול בפועל", description: "בדקו שאין חריגה מהתכנון", href: `${base}/budget` },
    { label: "עדכון לוח הזמנים", description: "ודאו שהשלבים הקרובים מעודכנים", href: `${base}/schedule` },
    { label: "העלאת מסמכים חשובים", description: "חוזים, תוכניות ואישורים במקום אחד", href: `${base}/documents` },
  ];
  for (const fallback of fallbacks) {
    if (actions.length >= 3) break;
    if (!actions.some((action) => action.href === fallback.href)) actions.push(fallback);
  }
}
