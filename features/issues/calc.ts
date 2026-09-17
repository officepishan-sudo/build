// פונקציה טהורה - נבדקת ב-calc.test.ts.
//
// פער סכימה מתועד: ל-Issue אין שדה resolutionNotes ייעודי (בניגוד ל-Defect
// שכן יש לו). כדי לא להמציא שדה חדש בסכימה, הערת הפתרון/הסגירה נשמרת
// בתוך שדה impact הקיים, עם כותרת ברורה שמפרידה אותה מהתיאור המקורי של
// ההשפעה - כדי שלא תימחק היסטוריה ולא תיווצר תחושה שהערת הפתרון "מוסתרת".
export function appendResolutionNote(
  existingImpact: string | null | undefined,
  action: "נפתר" | "נסגר",
  note: string,
  at: Date,
): string {
  const stamp = `[${action} - ${at.toISOString().slice(0, 10)}]: ${note}`;
  if (!existingImpact || existingImpact.trim().length === 0) return stamp;
  return `${existingImpact}\n\n${stamp}`;
}
