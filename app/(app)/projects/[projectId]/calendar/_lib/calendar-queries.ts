import { prisma } from "@/lib/prisma";
import { listPhasesWithTasks } from "@/features/schedule/repository";
import type { CalendarEvent } from "./calendar-types";

// כל שאילתה בבלוק try/catch נפרד: טבלה ריקה או פיצ'ר של סוכן אחר שעוד לא קיים
// (Delivery/Payment/Decision שייכים לפיצ'רים אחרים) לא אמורים להפיל את לוח השנה.

export async function loadCalendarEvents(projectId: string): Promise<CalendarEvent[]> {
  const results = await Promise.allSettled([
    loadTaskEvents(projectId),
    loadDeliveryEvents(projectId),
    loadPaymentEvents(projectId),
    loadDecisionEvents(projectId),
  ]);

  return results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}

async function loadTaskEvents(projectId: string): Promise<CalendarEvent[]> {
  try {
    const phases = await listPhasesWithTasks(projectId);
    return phases.flatMap((phase) =>
      phase.tasks
        .filter((task) => task.startDate)
        .map((task) => ({
          id: task.id,
          type: "task" as const,
          date: task.startDate as Date,
          title: task.title,
          subtitle: phase.name,
          href: `/projects/${projectId}/schedule`,
        })),
    );
  } catch (error) {
    console.error("[calendar-task-events]", error);
    return [];
  }
}

async function loadDeliveryEvents(projectId: string): Promise<CalendarEvent[]> {
  try {
    const deliveries = await prisma.delivery.findMany({
      where: { projectId, expectedDate: { not: null } },
      select: { id: true, expectedDate: true, itemsSummary: true },
    });
    return deliveries.map((d) => ({
      id: d.id,
      type: "delivery" as const,
      date: d.expectedDate as Date,
      title: d.itemsSummary ?? "אספקה",
      href: `/projects/${projectId}/deliveries`,
    }));
  } catch (error) {
    console.error("[calendar-delivery-events]", error);
    return [];
  }
}

async function loadPaymentEvents(projectId: string): Promise<CalendarEvent[]> {
  try {
    const payments = await prisma.payment.findMany({
      where: { projectId, dueDate: { not: null } },
      select: { id: true, dueDate: true, payeeName: true, amount: true },
    });
    return payments.map((p) => ({
      id: p.id,
      type: "payment" as const,
      date: p.dueDate as Date,
      title: `תשלום ל${p.payeeName}`,
      subtitle: String(p.amount),
      href: `/projects/${projectId}/payments`,
    }));
  } catch (error) {
    console.error("[calendar-payment-events]", error);
    return [];
  }
}

async function loadDecisionEvents(projectId: string): Promise<CalendarEvent[]> {
  try {
    const decisions = await prisma.decision.findMany({
      where: { projectId, deadline: { not: null } },
      select: { id: true, deadline: true, title: true },
    });
    return decisions.map((d) => ({
      id: d.id,
      type: "decision" as const,
      date: d.deadline as Date,
      title: d.title,
      href: `/projects/${projectId}/decisions`,
    }));
  } catch (error) {
    console.error("[calendar-decision-events]", error);
    return [];
  }
}
