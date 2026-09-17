import type { ChangeStatus } from "@prisma/client";
import { requireProjectAccess } from "@/lib/auth/rbac";
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "@/lib/errors";
import { canDeleteDraft, canTransition, isEditable } from "./transitions";
import { createChangeRequestSchema, updateChangeRequestSchema } from "./schema";
import * as repo from "./repository";

// מעברים שמותר לבצע דרך הפעולה הכללית (moveToStatus). אישור/דחייה/ביטול/סיום
// עוברים דרך פעולות ייעודיות בלבד, כדי שאישור יישאר פעולה מפורשת ומכוונת.
const GENERIC_TARGETS: ChangeStatus[] = ["CLARIFICATION", "PROPOSED", "APPROVAL"];

export async function listChangeRequests(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  return repo.listChangeRequestsByProject(projectId);
}

export async function getChangeRequest(userId: string, projectId: string, id: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  return requireChange(projectId, id);
}

export async function createChangeRequest(userId: string, projectId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  const data = createChangeRequestSchema.parse(input);
  return repo.createChangeRequest(projectId, data);
}

export async function updateChangeRequestDetails(userId: string, projectId: string, id: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  const cr = await requireChange(projectId, id);
  if (!isEditable(cr.status)) {
    throw new ConflictError("לא ניתן לערוך שינוי שכבר הוכרע - הפרטים ההיסטוריים נשמרים כפי שהם");
  }
  const data = updateChangeRequestSchema.parse(input);
  return repo.updateChangeRequestDetails(id, data);
}

/** מעבר סטטוס "רגיל" - הבהרה/הצעה/העברה לאישור. לא לאישור/דחייה/ביטול/סיום. */
export async function moveToStatus(userId: string, projectId: string, id: string, targetStatus: string) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  const cr = await requireChange(projectId, id);
  const target = targetStatus as ChangeStatus;
  if (!GENERIC_TARGETS.includes(target)) {
    throw new ValidationError("יש להשתמש בפעולה הייעודית עבור הסטטוס הזה (אישור/דחייה/ביטול/סיום)");
  }
  assertTransition(cr.status, target);
  return repo.updateStatus(id, target, null);
}

// "אשר" הוא פעולה מכוונת ומפורשת - לא מגיעים אליה דרך מעבר סטטוס כללי.
export async function approveChangeRequest(userId: string, projectId: string, id: string) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  const cr = await requireChange(projectId, id);
  assertTransition(cr.status, "APPROVED");
  return repo.updateStatus(id, "APPROVED", new Date());
}

export async function rejectChangeRequest(userId: string, projectId: string, id: string) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  const cr = await requireChange(projectId, id);
  assertTransition(cr.status, "REJECTED");
  return repo.updateStatus(id, "REJECTED", new Date());
}

export async function cancelChangeRequest(userId: string, projectId: string, id: string) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  const cr = await requireChange(projectId, id);
  assertTransition(cr.status, "CANCELLED");
  return repo.updateStatus(id, "CANCELLED", null);
}

export async function markChangeDone(userId: string, projectId: string, id: string) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  const cr = await requireChange(projectId, id);
  assertTransition(cr.status, "DONE");
  return repo.updateStatus(id, "DONE", null);
}

export async function deleteDraftChangeRequest(userId: string, projectId: string, id: string) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  const cr = await requireChange(projectId, id);
  if (!canDeleteDraft(cr.status)) {
    throw new ForbiddenError("אפשר למחוק רק שינוי בטיוטה - שינוי שהתקדם לא נמחק, רק מבוטל");
  }
  await repo.deleteDraft(id);
}

function assertTransition(from: ChangeStatus, to: ChangeStatus) {
  if (!canTransition(from, to)) {
    throw new ConflictError(`לא ניתן לעבור מסטטוס ${from} ל-${to}`);
  }
}

async function requireChange(projectId: string, id: string) {
  const cr = await repo.findChangeRequestById(projectId, id);
  if (!cr) throw new NotFoundError("שינוי");
  return cr;
}
