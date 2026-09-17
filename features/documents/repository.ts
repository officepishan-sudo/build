import { prisma } from "@/lib/prisma";
import type { CreateDocumentInput, UpdateDocumentInput } from "./schema";

export function listDocumentsByProject(projectId: string, category?: string) {
  return prisma.document.findMany({
    where: { projectId, ...(category ? { category } : {}) },
    orderBy: { uploadedAt: "desc" },
  });
}

export function findDocumentById(projectId: string, documentId: string) {
  return prisma.document.findFirst({ where: { id: documentId, projectId } });
}

export function createDocument(projectId: string, data: CreateDocumentInput) {
  return prisma.document.create({
    data: {
      projectId,
      category: data.category,
      name: data.name,
      fileUrl: data.fileUrl ?? "",
      notes: data.notes,
      relatedType: data.relatedType,
      relatedId: data.relatedId,
    },
  });
}

export function updateDocument(documentId: string, data: UpdateDocumentInput) {
  return prisma.document.update({
    where: { id: documentId },
    data: {
      category: data.category,
      name: data.name,
      fileUrl: data.fileUrl ?? "",
      notes: data.notes,
      relatedType: data.relatedType,
      relatedId: data.relatedId,
    },
  });
}

export function deleteDocument(documentId: string) {
  return prisma.document.delete({ where: { id: documentId } });
}
