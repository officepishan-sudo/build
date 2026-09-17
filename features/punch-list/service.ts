import { requireProjectAccess } from "@/lib/auth/rbac";
import { ConflictError, NotFoundError } from "@/lib/errors";
import { appendDefectNote } from "./calc";
import { closeDefectSchema, createDefectSchema, resolveDefectSchema, updateDefectStatusSchema } from "./schema";
import * as repo from "./repository";

export async function listDefects(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  return repo.listDefectsByProject(projectId);
}

export async function getDefect(userId: string, projectId: string, id: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  return requireDefectWithContext(projectId, id);
}

export async function createDefect(userId: string, projectId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const data = createDefectSchema.parse(input);
  return repo.createDefect(projectId, data);
}

/** מעבר חופשי בין OPEN/IN_PROGRESS בלבד - RESOLVED/CLOSED דורשים פעולה ייעודית. */
export async function updateDefectStatus(userId: string, projectId: string, id: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  await requireDefectShallow(projectId, id);
  const data = updateDefectStatusSchema.parse(input);
  return repo.updateStatus(id, data.status);
}

// "נפתר" - סימון מפורש עם פירוט התיקון, לעולם לא רק שינוי סטטוס.
export async function resolveDefect(userId: string, projectId: string, id: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const defect = await requireDefectShallow(projectId, id);
  const data = resolveDefectSchema.parse(input);
  const notes = appendDefectNote(defect.resolutionNotes, "תוקן", data.resolutionNotes, new Date());
  return repo.updateStatusWithNotes(id, "RESOLVED", notes);
}

export async function sendDefectForReview(userId: string, projectId: string, id: string) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const defect = await requireDefectShallow(projectId, id);
  if (defect.status !== "RESOLVED") {
    throw new ConflictError("אפשר להעביר לבדיקה רק ליקוי שסומן כנפתר");
  }
  return repo.updateStatus(id, "IN_REVIEW");
}

// "נפתר אינו נסגר" - סגירה היא פעולה נפרדת, אפשרית רק אחרי RESOLVED/IN_REVIEW,
// ודורשת אישור מפורש (לא נגזרת אוטומטית מסימון "נפתר").
export async function closeDefect(userId: string, projectId: string, id: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const defect = await requireDefectShallow(projectId, id);
  if (defect.status !== "RESOLVED" && defect.status !== "IN_REVIEW") {
    throw new ConflictError("אפשר לאשר סגירה רק אחרי שהליקוי סומן כנפתר");
  }
  const data = closeDefectSchema.parse(input);
  const notes = appendDefectNote(defect.resolutionNotes, "אושרה סגירה", data.closingNote, new Date());
  return repo.updateStatusWithNotes(id, "CLOSED", notes);
}

async function requireDefectShallow(projectId: string, id: string) {
  const defect = await repo.findDefectShallow(projectId, id);
  if (!defect) throw new NotFoundError("ליקוי");
  return defect;
}

async function requireDefectWithContext(projectId: string, id: string) {
  const defect = await repo.findDefectWithContext(projectId, id);
  if (!defect) throw new NotFoundError("ליקוי");
  return defect;
}
