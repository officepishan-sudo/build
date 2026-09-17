export const TEMPLATE_TYPE_VALUES = ["QUESTION", "ALTERNATIVE", "PRODUCT", "CHECKLIST_ITEM", "HELP"] as const;
export const TEMPLATE_STATUS_VALUES = ["DRAFT", "PUBLISHED"] as const;

export const TEMPLATE_TYPE_LABEL: Record<(typeof TEMPLATE_TYPE_VALUES)[number], string> = {
  QUESTION: "שאלה בשאלון",
  ALTERNATIVE: "חלופה",
  PRODUCT: "מוצר",
  CHECKLIST_ITEM: "סעיף ברשימת בדיקה רגולטורית",
  HELP: "עזרה",
};

export const TEMPLATE_STATUS_LABEL: Record<(typeof TEMPLATE_STATUS_VALUES)[number], string> = {
  DRAFT: "טיוטה",
  PUBLISHED: "פורסם",
};

// דוגמת מבנה payload לכל סוג - מוצג כהערה ידידותית ליד עורך ה-JSON (אין בונה טופס עשיר, זו טקסטה גולמית).
export const TEMPLATE_PAYLOAD_HINT: Record<(typeof TEMPLATE_TYPE_VALUES)[number], string> = {
  QUESTION: '{ "text": "טקסט השאלה", "helpText": "הסבר קצר", "branch": "ענף רלוונטי" }',
  ALTERNATIVE: '{ "title": "שם החלופה", "description": "תיאור", "priceMin": 1000, "priceMax": 2000 }',
  PRODUCT: '{ "name": "שם המוצר", "category": "קטגוריה", "unit": "יחידה" }',
  CHECKLIST_ITEM: '{ "projectType": "RENOVATION", "title": "כותרת הסעיף", "description": "הסבר" }',
  HELP: '{ "title": "כותרת", "body": "תוכן העזרה" }',
};
