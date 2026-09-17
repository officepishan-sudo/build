// לוגיקת סידור שלבים טהורה - בלי DB. נבדקת ב-scheduling.test.ts.

export type OrderedPhase = { id: string; order: number };

/**
 * מחשבת את הרשימה החדשה של {id, order} אחרי הזזת שלב אחד מקום אחד למעלה/למטה.
 * לא נוגעת ב-DB - service.ts מיישם את זה כעדכון order לשני השלבים שהתחלפו.
 * אם השלב כבר בקצה (הזזה בלתי אפשרית) - מחזירה את הרשימה המקורית ללא שינוי.
 */
export function movePhaseOrder(phases: OrderedPhase[], phaseId: string, direction: "up" | "down"): OrderedPhase[] {
  const sorted = [...phases].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((p) => p.id === phaseId);
  if (index === -1) return phases;

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= sorted.length) return phases;

  const swapped = [...sorted];
  const current = swapped[index] as OrderedPhase;
  const target = swapped[targetIndex] as OrderedPhase;
  swapped[index] = target;
  swapped[targetIndex] = current;

  return swapped.map((phase, i) => ({ id: phase.id, order: i }));
}
