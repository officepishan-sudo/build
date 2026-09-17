import { prisma } from "@/lib/prisma";

export function listMessagesByProject(projectId: string) {
  return prisma.message.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { id: true, name: true } },
      attachments: { select: { id: true, name: true, category: true } },
    },
  });
}

export function createMessage(
  projectId: string,
  authorUserId: string,
  data: { body: string; relatedType?: string; relatedId?: string; attachDocumentIds?: string[] },
) {
  return prisma.message.create({
    data: {
      projectId,
      authorUserId,
      body: data.body,
      relatedType: data.relatedType || null,
      relatedId: data.relatedId || null,
      attachments: data.attachDocumentIds?.length ? { connect: data.attachDocumentIds.map((id) => ({ id })) } : undefined,
    },
    include: { author: { select: { id: true, name: true } }, attachments: { select: { id: true, name: true } } },
  });
}

// יצירת רשומת מסמך קלה בהקשר של הודעה (DEC: אין backend להעלאת קבצים - רק URL מודבק).
export function createInlineDocument(projectId: string, name: string, fileUrl: string) {
  return prisma.document.create({
    data: { projectId, category: "תיעוד כללי", name, fileUrl },
  });
}

// מסמכי הפרויקט הזמינים לצירוף - שדות מינימליים בלבד, לא ייבוא של פיצ'ר documents.
export function listProjectDocumentsForAttachment(projectId: string) {
  return prisma.document.findMany({
    where: { projectId },
    orderBy: { uploadedAt: "desc" },
    select: { id: true, name: true, category: true },
  });
}

// משתתפי הפרויקט: הבעלים + כל השיתופים. Message לא מייבא את features/sharing - שאילתה עצמאית כאן.
export async function listProjectParticipants(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { owner: { select: { id: true, name: true, email: true } } },
  });
  const shares = await prisma.projectShare.findMany({
    where: { projectId },
    select: { level: true, user: { select: { id: true, name: true, email: true } } },
  });
  return { owner: project?.owner ?? null, shares };
}
