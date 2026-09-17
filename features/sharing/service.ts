import { requireProjectAccess } from "@/lib/auth/rbac";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/errors";
import { changeShareLevelSchema, inviteShareSchema } from "./schema";
import * as repo from "./repository";

export type InviteShareResult =
  | { status: "invited"; shareId: string }
  | { status: "not_registered"; email: string };

// צפייה ברשימת השיתופים מותרת מ-VIEW ומעלה - "מי רואה מה" זה עצמו מידע לגיטימי לצפייה.
// viewerLevel מוחזר כדי שהמסך יידע אם להציג כפתורי ניהול (רק OWNER/MANAGE).
export async function listShares(userId: string, projectId: string) {
  const access = await requireProjectAccess(projectId, userId, "VIEW");
  const [project, shares] = await Promise.all([
    repo.findProjectWithOwner(projectId),
    repo.listSharesByProject(projectId),
  ]);
  if (!project) throw new NotFoundError("פרויקט");
  const canManage = access.level === "OWNER" || access.level === "MANAGE";
  return { owner: project.owner, shares, canManage };
}

// זהו גבול האבטחה של כל האפליקציה: רק OWNER או MANAGE יכולים לשתף/לשנות/לבטל שיתוף.
export async function inviteUser(userId: string, projectId: string, input: unknown): Promise<InviteShareResult> {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const data = inviteShareSchema.parse(input);

  const project = await repo.findProjectWithOwner(projectId);
  if (!project) throw new NotFoundError("פרויקט");

  const targetUser = await repo.findUserByEmail(data.email);
  if (!targetUser) {
    return { status: "not_registered", email: data.email };
  }

  if (targetUser.id === project.ownerId) {
    throw new ValidationError("זהו כבר בעל הפרויקט - יש לו גישה מלאה ואי אפשר לשתף אותו מחדש");
  }

  const existing = await repo.findExistingShare(projectId, targetUser.id);
  if (existing) {
    throw new ConflictError("המשתמש כבר משותף בפרויקט - אפשר לשנות את רמת הגישה שלו במקום לשתף מחדש");
  }

  const share = await repo.createShare(projectId, targetUser.id, data.level, data.domain);
  return { status: "invited", shareId: share.id };
}

export async function changeShareLevel(userId: string, projectId: string, shareId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const share = await findExistingShare(projectId, shareId);
  const data = changeShareLevelSchema.parse(input);
  return repo.updateShareLevel(share.id, data.level, data.domain);
}

export async function removeShare(userId: string, projectId: string, shareId: string) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const share = await findExistingShare(projectId, shareId);
  return repo.deleteShare(share.id);
}

async function findExistingShare(projectId: string, shareId: string) {
  const share = await repo.findShareById(projectId, shareId);
  if (!share) throw new NotFoundError("שיתוף");
  return share;
}
