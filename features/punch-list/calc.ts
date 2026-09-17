// פונקציה טהורה - נבדקת ב-calc.test.ts. לא מיובאת מ-features/issues (אין
// ייבוא בין פיצ'רים) - כפילות קטנה ומכוונת של רעיון דומה, לא הפשטה מוקדמת.
export function appendDefectNote(
  existingNotes: string | null | undefined,
  label: "תוקן" | "אושרה סגירה",
  note: string,
  at: Date,
): string {
  const stamp = `[${label} - ${at.toISOString().slice(0, 10)}]: ${note}`;
  if (!existingNotes || existingNotes.trim().length === 0) return stamp;
  return `${existingNotes}\n\n${stamp}`;
}
