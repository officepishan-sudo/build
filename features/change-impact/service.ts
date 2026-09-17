import { requireProjectAccess } from "@/lib/auth/rbac";
import { computeChangeImpact, type ChangeImpactResult } from "@/lib/change-impact";
import { approveChangeSchema, changeImpactQuerySchema, type ChangeImpactQueryInput } from "./schema";
import * as repo from "./repository";

/**
 * מסך סקירה גנרי (P09) - מקבל "מה משתנה" מפרמטרים (query/body) ומחזיר את הפירוט
 * המחושב ע"י lib/change-impact.ts. לא תלוי בשום פיצ'ר ספציפי (חלופות/הזמנות/וכו').
 */
export async function reviewChangeImpact(userId: string, projectId: string, rawInput: unknown): Promise<ChangeImpactResult> {
  await requireProjectAccess(projectId, userId, "VIEW");
  const input: ChangeImpactQueryInput = changeImpactQuerySchema.parse(rawInput);
  return computeChangeImpact({ projectId, ...input });
}

/**
 * אישור מפורש בלבד: מחשב מחדש את הפירוט (לא סומך על מה שהגיע מהלקוח) ותמיד
 * כותב VersionSnapshot עם הסיבה ומי אישר - אף פעם לא נכתב בשקט.
 */
export async function approveChange(userId: string, projectId: string, rawInput: unknown) {
  const access = await requireProjectAccess(projectId, userId, "MANAGE");
  const { changeDescription, affectedRequirementIds, affectedQuoteIds, affectedOrderIds, affectedQuantityItemIds, reason } =
    changeImpactQuerySchema.merge(approveChangeSchema).parse(rawInput);

  const impact = await computeChangeImpact({
    projectId,
    changeDescription,
    affectedRequirementIds,
    affectedQuoteIds,
    affectedOrderIds,
    affectedQuantityItemIds,
  });

  return repo.recordApprovedChangeReview(projectId, access.userId, impact, reason);
}
