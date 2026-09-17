// סט שאלות ברירת מחדל לשאלון הדינמי (P05) - נטען עם upsert אידמפוטנטי
// באמצעות repository.ensureDefaultQuestions() בטעינה הראשונה של המסך.
// זהו תוכן התחלתי בסיסי לפרויקט שיפוץ/בנייה - אפשר להרחיב בעתיד דרך ContentTemplate.

export type DefaultQuestion = {
  key: string;
  text: string;
  helpText?: string;
  branch?: string;
  order: number;
};

export const DEFAULT_QUESTIONS: DefaultQuestion[] = [
  { key: "project_goal", text: "מה המטרה המרכזית של הפרויקט?", order: 1 },
  { key: "budget_range", text: "מה טווח התקציב המשוער?", helpText: "אפשר טווח גס - זה לא סופי", order: 2 },
  { key: "timeline", text: "מתי הייתם רוצים להתחיל?", order: 3 },
  { key: "timeline_flexibility", text: "כמה גמישים אתם בלוחות הזמנים?", order: 4 },
  { key: "style_preference", text: "איזה סגנון עיצובי מדבר אליכם?", order: 5 },
  { key: "existing_condition", text: "מה מצב הנכס כיום?", order: 6 },
  { key: "living_during_work", text: "האם תגורו בנכס בזמן הביצוע?", order: 7 },
  { key: "permits_needed", text: "האם ידוע לכם על צורך בהיתרים?", branch: "regulatory", order: 8 },
  { key: "professionals_hired", text: "האם כבר יש בעלי מקצוע שעובדים איתכם?", order: 9 },
  { key: "materials_quality", text: "מה רמת האיכות המבוקשת בחומרים?", order: 10 },
  { key: "special_needs", text: "האם יש דרישות נגישות או צרכים מיוחדים?", order: 11 },
  { key: "decision_makers", text: "מי מעורב בקבלת ההחלטות בפרויקט?", order: 12 },
];
