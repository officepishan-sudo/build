# ניהול פרויקט בנייה

אפליקציית תכנון וניהול פרויקטי בנייה - מרעיון ועד מסירה: דרישות, חלופות,
כתב כמויות, לוח זמנים, בעלי מקצוע וספקים, הצעות מחיר, הזמנות, אספקות, תקציב
ותשלומים, שינויים, בעיות וליקויים, מסמכים ותמונות, שיתוף והרשאות, ואחריות
ותחזוקה.

נבנתה לפי `MASTER PRODUCT SPEC — FINAL` (39 מסכים). ראו `docs/build-plan.md`
להחלטות הארכיטקטורה והמוצר, ו-`docs/build-status.md` למצב נוכחי, פערים
ידועים, ומה נשאר לעשות לפני פריסה אמיתית.

## הרצה מקומית

```bash
cp .env.example .env
docker compose up -d db        # PostgreSQL מקומי (או שרת Postgres קיים - עדכנו DATABASE_URL)
npm install
npm run db:migrate
npm run db:seed                # משתמש דמו: demo@example.com / Password123!
npm run dev                    # http://localhost:3000
```

## בדיקות ו-gates

```bash
npm run typecheck
npm run lint
npm run structure:gate         # scripts/structure-gate.sh - מבנה קוד ושכבות
npx depcruise --config .dependency-cruiser.cjs app features components lib
npm run test                   # דורש DB בדיקות: build_app_test (ראו .env.example)
npm run build
```

## Stack

Next.js 14 (App Router) · TypeScript · Prisma · PostgreSQL · Tailwind CSS ·
Vitest. ראו `docs/build-plan.md` סעיף 1.
