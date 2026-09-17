import { requireProjectAccess } from "@/lib/auth/rbac";
import { sendMessageSchema } from "./schema";
import * as repo from "./repository";

export async function listMessages(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  return repo.listMessagesByProject(projectId);
}

export async function listParticipants(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  return repo.listProjectParticipants(projectId);
}

export async function listAttachableDocuments(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  return repo.listProjectDocumentsForAttachment(projectId);
}

// שליחת הודעה דורשת לפחות COMMENT (הרמה שבה נפתחת השתתפות בתקשורת - סעיף 14).
export async function sendMessage(userId: string, projectId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "COMMENT");
  const data = sendMessageSchema.parse(input);

  const attachDocumentIds: string[] = [];
  if (data.existingDocumentId) {
    attachDocumentIds.push(data.existingDocumentId);
  } else if (data.newDocumentName && data.newDocumentUrl) {
    const doc = await repo.createInlineDocument(projectId, data.newDocumentName, data.newDocumentUrl);
    attachDocumentIds.push(doc.id);
  }

  return repo.createMessage(projectId, userId, {
    body: data.body,
    relatedType: data.relatedType,
    relatedId: data.relatedId,
    attachDocumentIds,
  });
}
