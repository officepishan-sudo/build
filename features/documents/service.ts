import { requireProjectAccess } from "@/lib/auth/rbac";
import { NotFoundError } from "@/lib/errors";
import { createDocumentSchema, updateDocumentSchema } from "./schema";
import * as repo from "./repository";

export async function listDocuments(userId: string, projectId: string, category?: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  return repo.listDocumentsByProject(projectId, category);
}

export async function getDocument(userId: string, projectId: string, documentId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  return findExisting(projectId, documentId);
}

// הוספה/עריכה/מחיקה של מסמך היא תרומת תוכן לפרויקט - דורשת לפחות COMMENT.
export async function createDocument(userId: string, projectId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "COMMENT");
  const data = createDocumentSchema.parse(input);
  return repo.createDocument(projectId, data);
}

export async function updateDocument(userId: string, projectId: string, documentId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "COMMENT");
  await findExisting(projectId, documentId);
  const data = updateDocumentSchema.parse(input);
  return repo.updateDocument(documentId, data);
}

export async function deleteDocument(userId: string, projectId: string, documentId: string) {
  await requireProjectAccess(projectId, userId, "COMMENT");
  await findExisting(projectId, documentId);
  return repo.deleteDocument(documentId);
}

async function findExisting(projectId: string, documentId: string) {
  const doc = await repo.findDocumentById(projectId, documentId);
  if (!doc) throw new NotFoundError("מסמך");
  return doc;
}
