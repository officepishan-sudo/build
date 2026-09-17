# תכנית האפליקציה - ניהול פרויקט בנייה

מסמך זה מתעד את ההחלטות שהתקבלו בבניית האפליקציה על בסיס `MASTER PRODUCT SPEC —
FINAL` (39 מסכים) שהועלה על ידי המשתמש, ואת ה-Stack/מבנה לפי ברירות המחדל של
`new-app-kit` (`profiles/vps-ubuntu-pm2-cloudflare.md`) בריפו `sh`.

**חשוב להבין**: זו לא הרצה מלאה ומאושרת של `new-app-kit` - זו בנייה פרגמטית
בסטנדרט טוב (מבנה קוד, בדיקות אמיתיות, gates ירוקים) שמדלגת במכוון על השלבים
שדורשים פעולה אנושית (אישורי בעלים מהטרמינל, ביקורת אבטחה בסשן נפרד, תרגולי
שרת פיזיים). ראו `docs/build-status.md` לרשימת "מה נשאר לך" המלאה.

## 0. היקף

המשתמש ביקש "מלוא הערכה, בלי שאלון פתיחה" והסמיך אותי לקבל בעצמי החלטות מוצר
שהמסמך המקורי (סעיף 20 שם) השאיר פתוחות. ההחלטות האלה מתועדות כ-DEC למטה.

## 1. Stack

- Next.js 14 (App Router) + TypeScript + Prisma + PostgreSQL 16, Tailwind CSS.
- אימות: session cookie חתום (JWT/HS256 דרך `jose`) + bcrypt, לא NextAuth (כדי
  לשלוט במלואה בזרימת ה-RBAC המבוססת על `ProjectShare.level`).
- מבנה קוד: `app/` (ראוטינג דק, page.tsx ≤80 שורות, בלי `'use client'`) →
  `features/<domain>/{schema,repository,service,actions,components}` →
  `components/ui/` + `lib/` (משותפים). Prisma רק ב-`repository.ts`/`lib/db/`.
  נאכף ע"י `scripts/structure-gate.sh` + `.dependency-cruiser.cjs` +
  `eslint.config.mjs` (מועתקים ומותאמים מ-`code-structure` skill).
- בדיקות: Vitest + Postgres אמיתי לבדיקות (`build_app_test`), לפי
  `app-testing` skill (`tests/helpers/test-db.ts`, `factories.ts`).

## 2. מודל הנתונים

`prisma/schema.prisma` - סכימה אחת מקיפה שמכסה את כל מילון האובייקטים
(סעיף 9 במסמך): Project, Phase, Task, Requirement, Decision, Alternative,
QuantityItem, Professional, Supplier, Product, Review, QuoteRequest, Quote,
CartItem, Order, Delivery, BudgetLine, Expense, Payment, ChangeRequest, Issue,
Defect, Document, Photo, Message, Warranty, MaintenanceItem, Notification,
ProjectShare, Room, InteriorItem, CanvasElement, InspirationImage,
RegulatoryChecklistItem, ContentTemplate, VersionSnapshot, User.

## 3. החלטות מוצר (DEC) - נקודות שהמסמך המקורי השאיר פתוחות (סעיף 20)

| # | נושא | החלטה |
|---|---|---|
| DEC-01 | מקורות חיצוניים למחירים/זמינות/ביקורות | אין אינטגרציה חיצונית - הכל מוזן ידנית ע"י המשתמש/בעלי מקצוע/ספקים/אדמין |
| DEC-02 | תשלומים בפועל | המערכת **מתעדת** תשלומים בלבד - אין סליקה/גייטוויי אמיתי |
| DEC-03 | אינטגרציות חיצוניות | אין - לא מייל אמיתי יוצא, לא WhatsApp, לא סנכרון יומן; התראות הן In-app בלבד |
| DEC-04 | מדיניות מסמכים רשמיים | העלאת מסמך = שדה URL חופשי + קטגוריה; אין חתימה דיגיטלית/אימות משפטי |
| DEC-05 | עומק קנבס/Visualizer | קנבס = תמונת בסיס + פינים ב-x/y עם תווית/הערה (בלי CAD); "Visualizer"/"AI Q&A" **לא נבנו בכלל** - בהתאם לכלל "לא להמציא" (סעיף 17) |
| DEC-06 | רגולציה | Checklist סטטי לפי סוג פרויקט, מנוהל ע"י אדמין (`ContentTemplate` מסוג `CHECKLIST_ITEM`), עם באנר "אינו ייעוץ משפטי/הנדסי" קבוע |
| DEC-07 | הרשאות מדויקות לכל סוג משתתף | ארבע רמות (VIEW/COMMENT/DECIDE/MANAGE) + OWNER, לפי `ProjectShare.level`; כל שירות אוכף `requireProjectAccess` |
| DEC-08 | עומק מסלול "רק הצעות מחיר" | בדיוק לפי מה שהוגדר (מפרט→גורמים→בקשה→הצעות→השוואה→בחירה) - `ProjectTrack.QUOTES_ONLY`, בלי הרחבה |

## 4. מיפוי מסכים → ראוטים

כל 39 המסכים נבנו. מיפוי מלא ב-`docs/build-traceability.md` (ראו קובץ נפרד
שנכתב ע"י כמה מהסוכנים המקבילים - נסרק ואומת בסבב האינטגרציה).

מסכים גלובליים (לא תלויי-פרויקט): `/`, `/onboarding`, `/projects/new`,
`/professionals`, `/professionals/[id]`, `/suppliers`, `/suppliers/[id]`,
`/notifications`, `/admin/content`.

כל שאר המסכים תחת `/projects/[projectId]/...` (ראו `app/(app)/projects/[projectId]/`).

## 5. איך נבנה בפועל

הבנייה בוצעה במקביל ע"י 8 "בונים" (subagents) שכל אחד קיבל נתיבי קבצים
ייעודיים (בלי חפיפה), את קטע המפרט הרלוונטי מהמסמך המקורי, ואת אותה תבנית
קוד מחייבת (מודגמת ב-`features/projects`+`features/auth`, שנבנו קודם כ"פרוסה
אנכית ראשונה" ואומתו ידנית - migrate+seed+build+test לפני שהופצו כדוגמה).
בסבב אינטגרציה מרכזי לאחר מכן: תוקנו קונפליקטים בקבצי תשתית משותפים
(`eslint.config.mjs`, `.dependency-cruiser.cjs`, `scripts/structure-gate.sh`),
תוקן race condition אמיתי בתשתית הבדיקות (ריצת קבצי vitest במקביל על DB
משותף עם TRUNCATE ב-`beforeEach`), תוקן באג לוגי אמיתי בפיצ'ר הקנבס (תמונת
בסיס שנקבעה לפני יצירת פין ראשון "נעלמה"), ובוצע smoke test עם דפדפן אמיתי
(Playwright) על כל 39 המסכים אחרי התחברות אמיתית.
