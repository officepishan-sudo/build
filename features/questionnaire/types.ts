// טיפוסים משותפים לרכיבי ה-UI ול-service של השאלון. בקובץ נפרד מ-service.ts כי
// dependency-cruiser חוסם ייבוא של *service.ts מתוך components/hooks (גם ייבוא טיפוסים).

export type QuestionnaireQuestionView = {
  key: string;
  text: string;
  helpText: string | null;
  branch: string | null;
  order: number;
};

export type QuestionnaireAnswerView = { answerValue: string | null; isUnknown: boolean };

export type QuestionnaireState = {
  questions: QuestionnaireQuestionView[];
  answers: Record<string, QuestionnaireAnswerView>;
};
