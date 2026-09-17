import { prisma } from "@/lib/prisma";
import type { AddPhotoInput, EditPhotoInput } from "./schema";

export function listPhotosByProject(projectId: string) {
  return prisma.photo.findMany({
    where: { projectId },
    orderBy: [{ takenAt: "asc" }],
    include: { phase: { select: { id: true, name: true } } },
  });
}

export function findPhotoById(projectId: string, photoId: string) {
  return prisma.photo.findFirst({ where: { id: photoId, projectId } });
}

// קריאת Phase ישירות מתוך repository של פיצ'ר אחר מותרת (הפרויקט מתעד זאת ב-code-structure) -
// זו לא ייבוא של לוגיקת פיצ'ר, רק שאילתת תצוגה מינימלית לתפריט הבחירה.
export function listPhasesForProject(projectId: string) {
  return prisma.phase.findMany({
    where: { projectId },
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });
}

export function createPhoto(projectId: string, data: AddPhotoInput) {
  return prisma.photo.create({
    data: {
      projectId,
      phaseId: data.phaseId || null,
      url: data.url,
      takenAt: data.takenAt ?? new Date(),
      caption: data.caption,
      isBeforeAfter: data.isBeforeAfter,
    },
  });
}

export function updatePhoto(photoId: string, data: EditPhotoInput) {
  return prisma.photo.update({
    where: { id: photoId },
    data: {
      phaseId: data.phaseId || null,
      url: data.url,
      takenAt: data.takenAt ?? new Date(),
      caption: data.caption,
      isBeforeAfter: data.isBeforeAfter,
    },
  });
}
