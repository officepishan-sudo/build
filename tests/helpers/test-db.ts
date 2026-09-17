import { prisma } from "@/lib/prisma";

export function databaseNameFromUrl(url: string | undefined): string {
  if (!url) return "";
  try {
    return decodeURIComponent(new URL(url).pathname.replace(/^\//, ""));
  } catch {
    return "";
  }
}

// הגנה קריטית: TRUNCATE על DB אמיתי הוא אסון - שם ה-DB חייב להסתיים ב-_test ולא להכיל "prod".
const TEST_DB_NAME = /_test(_\d+)?$/;

export function assertTestDatabaseUrl(url: string | undefined): void {
  const name = databaseNameFromUrl(url);
  if (!TEST_DB_NAME.test(name) || /prod/i.test(name)) {
    const shown = (url ?? "(ריק)").replace(/:[^:@/]*@/, ":***@");
    throw new Error(
      `סירוב: DATABASE_URL של הבדיקות חייב להצביע על DB ששמו מסתיים ב-_test. התקבל: ${shown} (שם DB: "${name || "?"}")`,
    );
  }
}

export async function resetDb(): Promise<void> {
  assertTestDatabaseUrl(process.env.DATABASE_URL);
  const tables = await prisma.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'
  `;
  if (tables.length === 0) return;
  const list = tables.map((t) => `"public"."${t.tablename.replace(/"/g, '""')}"`).join(", ");
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${list} RESTART IDENTITY CASCADE`);
}
