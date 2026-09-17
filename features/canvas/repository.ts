import { prisma } from "@/lib/prisma";
import type { PinInput } from "./schema";

// כל הפינים חולקים את אותה תמונת בסיס (imageUrl משוכפל על כל שורה - אין מודל Canvas
// נפרד בסכימה) - שינוי תמונה מעדכן את כולם יחד כדי שלא ייווצר פיצול בין פינים.
//
// כשעדיין אין אף פין, אין שורה לעדכן - ולכן תמונת הבסיס הייתה "נעלמת" עד הפין הראשון.
// הפתרון: שורת-עוגן בלתי-נראית (note="__base_image_anchor__", בלי label) ששומרת את
// ה-URL גם כשאין פינים; listPins מסנן אותה כדי שלא תוצג כפין אמיתי.
const BASE_IMAGE_ANCHOR_NOTE = "__base_image_anchor__";

export function findCurrentBaseImageUrl(projectId: string) {
  return prisma.canvasElement.findFirst({
    where: { projectId, imageUrl: { not: null } },
    orderBy: { createdAt: "desc" },
    select: { imageUrl: true },
  });
}

export async function setBaseImageForAllPins(projectId: string, imageUrl: string) {
  await prisma.canvasElement.updateMany({ where: { projectId }, data: { imageUrl } });
  const anyRow = await prisma.canvasElement.findFirst({ where: { projectId }, select: { id: true } });
  if (!anyRow) {
    await prisma.canvasElement.create({
      data: { projectId, imageUrl, x: 0, y: 0, note: BASE_IMAGE_ANCHOR_NOTE },
    });
  }
}

export function listPins(projectId: string) {
  return prisma.canvasElement.findMany({
    where: { projectId, note: { not: BASE_IMAGE_ANCHOR_NOTE } },
    orderBy: { createdAt: "asc" },
  });
}

export function findPinById(projectId: string, pinId: string) {
  return prisma.canvasElement.findFirst({ where: { id: pinId, projectId } });
}

export function createPin(projectId: string, imageUrl: string | null, data: PinInput) {
  return prisma.canvasElement.create({
    data: {
      projectId,
      imageUrl,
      x: data.x,
      y: data.y,
      label: data.label,
      note: data.note,
      linkedRequirementId: data.linkedRequirementId,
    },
  });
}

export function updatePin(pinId: string, data: PinInput) {
  return prisma.canvasElement.update({
    where: { id: pinId },
    data: { x: data.x, y: data.y, label: data.label, note: data.note, linkedRequirementId: data.linkedRequirementId },
  });
}

export function deletePin(pinId: string) {
  return prisma.canvasElement.delete({ where: { id: pinId } });
}

// קריאה בלבד: Requirement שייך לפיצ'ר questionnaire (סוכן אחר) - כאן רק לצורך קישור פין אליו.
export function listProjectRequirements(projectId: string) {
  return prisma.requirement.findMany({
    where: { projectId },
    select: { id: true, label: true },
    orderBy: { createdAt: "asc" },
  });
}
