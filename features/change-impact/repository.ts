import { prisma } from "@/lib/prisma";

// כתיבה יחידה של הפיצ'ר הזה: תיעוד אישור סקירת השפעה כ-VersionSnapshot.
// שום מוטציה עסקית אחרת (הזמנות/הצעות/משימות) לא נעשית כאן - זה מסך גנרי לסקירה בלבד.
export function recordApprovedChangeReview(
  projectId: string,
  createdByUserId: string,
  dataAfter: unknown,
  reason: string,
) {
  return prisma.versionSnapshot.create({
    data: {
      projectId,
      entityType: "ChangeImpactReview",
      entityId: projectId,
      dataBefore: undefined,
      dataAfter: dataAfter as never,
      reason,
      createdByUserId,
    },
  });
}
