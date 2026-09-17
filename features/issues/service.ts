import { requireProjectAccess } from "@/lib/auth/rbac";
import { ConflictError, NotFoundError } from "@/lib/errors";
import { appendResolutionNote } from "./calc";
import { createIssueSchema, resolveIssueSchema, updateIssueStatusSchema } from "./schema";
import * as repo from "./repository";

export async function listIssues(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  return repo.listIssuesByProject(projectId);
}

export async function getIssue(userId: string, projectId: string, id: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  return requireIssueWithContext(projectId, id);
}

export async function createIssue(userId: string, projectId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const data = createIssueSchema.parse(input);
  return repo.createIssue(projectId, data);
}

/** עדכון סטטוס "חופשי" - רק בין OPEN/IN_PROGRESS/WAITING, בלי הערת פתרון. */
export async function updateIssueStatus(userId: string, projectId: string, id: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  await requireIssueShallow(projectId, id);
  const data = updateIssueStatusSchema.parse(input);
  return repo.updateStatus(id, data.status);
}

// "לא להפוך הצעה לא-מאושרת לפתרון מאושר" - resolve/close תמיד עם הערה מפורשת.
export async function resolveIssue(userId: string, projectId: string, id: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const issue = await requireIssueShallow(projectId, id);
  const data = resolveIssueSchema.parse(input);
  const impact = appendResolutionNote(issue.impact, "נפתר", data.resolutionNote, new Date());
  return repo.resolveWithNote(id, "RESOLVED", impact);
}

// סגירה אפשרית רק אחרי פתרון - מישהו צריך לאשר את התיקון לפני סגירה סופית.
export async function closeIssue(userId: string, projectId: string, id: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const issue = await requireIssueShallow(projectId, id);
  if (issue.status !== "RESOLVED") {
    throw new ConflictError("אפשר לסגור בעיה רק אחרי שסומנה כנפתרה");
  }
  const data = resolveIssueSchema.parse(input);
  const impact = appendResolutionNote(issue.impact, "נסגר", data.resolutionNote, new Date());
  return repo.resolveWithNote(id, "CLOSED", impact);
}

async function requireIssueShallow(projectId: string, id: string) {
  const issue = await repo.findIssueShallow(projectId, id);
  if (!issue) throw new NotFoundError("בעיה");
  return issue;
}

async function requireIssueWithContext(projectId: string, id: string) {
  const issue = await repo.findIssueWithContext(projectId, id);
  if (!issue) throw new NotFoundError("בעיה");
  return issue;
}
