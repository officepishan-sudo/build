import { requireProjectAccess } from "@/lib/auth/rbac";
import { NotFoundError } from "@/lib/errors";
import { computeChangeImpact, type ChangeImpactResult } from "@/lib/change-impact";
import { applyPlaySchema, createAlternativeSchema, selectAlternativeSchema } from "./schema";
import * as repo from "./repository";

export async function listAlternatives(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  return repo.listAlternativesForProject(projectId);
}

async function getOwnedAlternative(projectId: string, alternativeId: string) {
  const alt = await repo.findAlternativeById(alternativeId);
  if (!alt || alt.projectId !== projectId) {
    throw new NotFoundError("חלופה");
  }
  return alt;
}

export async function getAlternative(userId: string, projectId: string, alternativeId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  return getOwnedAlternative(projectId, alternativeId);
}

/**
 * יוצר חלופה כ"שורה ניתנת ליצירה ידנית" - אין כאן מנוע יצירה/AI (DEC),
 * המשתמש/מנהל הפרויקט ממלא טופס. reasonShown חובה כדי שתמיד יהיה "למה אני רואה זאת".
 */
export async function createAlternative(userId: string, projectId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const data = createAlternativeSchema.parse(input);
  const requirementsSnapshot = await repo.listRequirementsForProject(projectId);
  return repo.createAlternative(projectId, data, requirementsSnapshot);
}

/**
 * בודקת אם בחירת החלופה נוגעת בהצעות/הזמנות קיימות בפרויקט - ואם כן מחזירה
 * את פירוט ההשפעה (lib/change-impact.ts) כדי להציג לפני אישור סופי (P07→P09).
 */
export async function getSelectionImpact(
  userId: string,
  projectId: string,
  alternativeId: string,
): Promise<ChangeImpactResult | null> {
  await requireProjectAccess(projectId, userId, "VIEW");
  const alt = await getOwnedAlternative(projectId, alternativeId);
  const [quotes, orders] = await repo.listQuoteAndOrderIdsForProject(projectId);
  if (quotes.length === 0 && orders.length === 0) return null;

  return computeChangeImpact({
    projectId,
    changeDescription: `בחירת חלופה: ${alt.title}`,
    affectedQuoteIds: quotes.map((q) => q.id),
    affectedOrderIds: orders.map((o) => o.id),
  });
}

/**
 * הבחירה עצמה: תמיד דרך אישור מפורש (אף פעם לא אוטומטי), ותמיד משאירה תיעוד
 * (VersionSnapshot) - ולכן ניתנת לשינוי מאוחר יותר, לא "סופית".
 */
export async function confirmSelectAlternative(userId: string, projectId: string, alternativeId: string, input: unknown) {
  const access = await requireProjectAccess(projectId, userId, "DECIDE");
  const alt = await getOwnedAlternative(projectId, alternativeId);
  const { reason } = selectAlternativeSchema.parse(input);

  const before = { isSelected: alt.isSelected };
  const updated = await repo.selectAlternative(projectId, alternativeId, alt.title);
  await repo.recordVersionSnapshot(
    projectId,
    access.userId,
    "Alternative",
    alternativeId,
    before,
    { isSelected: true },
    reason?.trim() || `בחירת חלופה: ${alt.title}`,
  );
  return updated;
}

export async function getPlayInitialValues(userId: string, projectId: string, alternativeId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  const alt = await getOwnedAlternative(projectId, alternativeId);
  return {
    id: alt.id,
    title: alt.title,
    priceMin: alt.priceMin ? Number(alt.priceMin) : 0,
    priceMax: alt.priceMax ? Number(alt.priceMax) : 0,
    durationDays: alt.durationDays,
    maintenanceNotes: alt.maintenanceNotes,
  };
}

/**
 * "החל" (Apply) בשחק-עם-התוצאה: כל שינוי הוא הצעה עד הרגע הזה (סטייט מקומי בלקוח
 * בלבד) - רק כאן נכתב לשרת, ותמיד עם VersionSnapshot לפני/אחרי.
 */
export async function applyPlayChanges(userId: string, projectId: string, alternativeId: string, input: unknown) {
  const access = await requireProjectAccess(projectId, userId, "DECIDE");
  const alt = await getOwnedAlternative(projectId, alternativeId);
  const data = applyPlaySchema.parse(input);

  const before = { priceMin: alt.priceMin, priceMax: alt.priceMax, durationDays: alt.durationDays, maintenanceNotes: alt.maintenanceNotes };
  const updated = await repo.applyPlayChanges(alternativeId, data);
  await repo.recordVersionSnapshot(
    projectId,
    access.userId,
    "Alternative",
    alternativeId,
    before,
    data,
    "עדכון מתוך מסך 'שחק עם התוצאה'",
  );
  return updated;
}
