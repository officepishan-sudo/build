import { ForbiddenError, NotFoundError } from "@/lib/errors";
import { findOwnedAndSharedProjectIds, findProjectOwnership, findProjectShare } from "@/lib/db/project-access";
import type { ShareLevel } from "@prisma/client";

// דירוג רמות שיתוף (סעיף 14 במסמך): צפייה < תגובה < השתתפות בהחלטות < ניהול < בעלים.
const LEVEL_RANK: Record<ShareLevel, number> = {
  VIEW: 1,
  COMMENT: 2,
  DECIDE: 3,
  MANAGE: 4,
  OWNER: 5,
};

export type ProjectAccess = {
  projectId: string;
  userId: string;
  level: ShareLevel;
};

/**
 * מוודא שלמשתמש יש גישה לפרויקט ברמה הנדרשת לפחות.
 * הבעלים תמיד ברמת OWNER. אין הנחה שכל משתתף רואה הכל - זה נבדק בכל שער.
 */
export async function requireProjectAccess(
  projectId: string,
  userId: string,
  minLevel: ShareLevel,
): Promise<ProjectAccess> {
  const project = await findProjectOwnership(projectId);
  if (!project) {
    throw new NotFoundError("פרויקט");
  }

  if (project.ownerId === userId) {
    return { projectId, userId, level: "OWNER" };
  }

  const share = await findProjectShare(projectId, userId);

  if (!share || LEVEL_RANK[share.level] < LEVEL_RANK[minLevel]) {
    throw new ForbiddenError();
  }

  return { projectId, userId, level: share.level };
}

export async function listAccessibleProjectIds(userId: string): Promise<string[]> {
  const [owned, shared] = await findOwnedAndSharedProjectIds(userId);
  return [...new Set([...owned.map((p) => p.id), ...shared.map((s) => s.projectId)])];
}
