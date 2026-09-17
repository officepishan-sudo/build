import { requireProjectAccess } from "@/lib/auth/rbac";
import { NotFoundError } from "@/lib/errors";
import { createDecisionSchema, markDecidedSchema } from "./schema";
import * as repo from "./repository";

export async function listDecisions(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  return repo.listDecisionsByProject(projectId);
}

export async function getDecision(userId: string, projectId: string, decisionId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  return findExistingDecision(projectId, decisionId);
}

// שימוש עבור דשבורד הפרויקט (P11) - מונה + מספר החלטות פתוחות קרובות לדדליין.
export async function getOpenDecisionsSummary(userId: string, projectId: string, take = 5) {
  await requireProjectAccess(projectId, userId, "VIEW");
  const [count, items] = await Promise.all([
    repo.countOpenDecisions(projectId),
    repo.listOpenDecisions(projectId, take),
  ]);
  return { count, items };
}

export async function createDecision(userId: string, projectId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  const data = createDecisionSchema.parse(input);
  return repo.createDecision(projectId, data);
}

export async function markDecided(userId: string, projectId: string, decisionId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  const data = markDecidedSchema.parse(input);
  await findExistingDecision(projectId, decisionId);
  return repo.updateDecisionStatus(decisionId, {
    status: "DECIDED",
    decidedValue: data.decidedValue,
    decidedAt: new Date(),
  });
}

// Edge case: "לא יודע" לא סוגר החלטה - הסטטוס עובר ל-NEEDS_CHECK, לעולם לא DECIDED בלי ערך.
export async function markNeedsCheck(userId: string, projectId: string, decisionId: string) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  await findExistingDecision(projectId, decisionId);
  return repo.updateDecisionStatus(decisionId, { status: "NEEDS_CHECK", decidedValue: null, decidedAt: null });
}

// "השאר פתוח" - חזרה מפורשת למצב פתוח (למשל אחרי "דורש בדיקה" שהתברר כלא רלוונטי).
export async function markOpen(userId: string, projectId: string, decisionId: string) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  await findExistingDecision(projectId, decisionId);
  return repo.updateDecisionStatus(decisionId, { status: "OPEN", decidedValue: null, decidedAt: null });
}

async function findExistingDecision(projectId: string, decisionId: string) {
  const decision = await repo.findDecisionById(projectId, decisionId);
  if (!decision) throw new NotFoundError("החלטה");
  return decision;
}
