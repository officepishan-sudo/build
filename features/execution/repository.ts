import { prisma } from "@/lib/prisma";
import type { TaskStatus } from "@prisma/client";

// קריאה ישירה ל-Phase/Task (בבעלות המוצרית של features/schedule של סוכן אחר) - execution
// עוקב אחרי סטטוס יומיומי ולא כותב מבנה (יצירת/עריכת שלבים ומשימות נשארת ב-schedule).
export function listPhasesWithTasks(projectId: string) {
  return prisma.phase.findMany({
    where: { projectId },
    include: {
      tasks: { include: { assignee: true }, orderBy: { startDate: "asc" } },
      _count: { select: { photos: true } },
    },
    orderBy: { order: "asc" },
  });
}

export function countProjectDocuments(projectId: string) {
  return prisma.document.count({ where: { projectId } });
}

export function countProjectExpenses(projectId: string) {
  return prisma.expense.count({ where: { projectId } });
}

export function findTask(taskId: string) {
  return prisma.task.findUnique({ where: { id: taskId } });
}

export function updateTaskStatus(taskId: string, status: TaskStatus) {
  return prisma.task.update({ where: { id: taskId }, data: { status } });
}
