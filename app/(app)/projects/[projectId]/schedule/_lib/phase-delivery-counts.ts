import { prisma } from "@/lib/prisma";

// אגרגציה חוצת-דומיין ברמת עמוד בלבד (מותר תחת app/**/_lib - ראו .dependency-cruiser.cjs):
// כמה אספקות (Delivery, בבעלות פיצ'ר אחר) משויכות לכל שלב. מידעי בלבד, read-only.
// עטוף ב-try/catch כדי שטבלה ריקה/לא קיימת עדיין לא תפיל את מסך לוח הזמנים.
export async function getDeliveryCountsByPhase(projectId: string): Promise<Record<string, number>> {
  try {
    const rows = await prisma.delivery.groupBy({
      by: ["phaseId"],
      where: { projectId, phaseId: { not: null } },
      _count: { _all: true },
    });
    return Object.fromEntries(rows.filter((r) => r.phaseId).map((r) => [r.phaseId as string, r._count._all]));
  } catch (error) {
    console.error("[phase-delivery-counts]", error);
    return {};
  }
}
