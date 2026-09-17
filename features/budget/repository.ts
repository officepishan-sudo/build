import { prisma } from "@/lib/prisma";
import type { CreateBudgetLineInput, LogExpenseInput, UpdateBudgetLineInput } from "./schema";

const LINE_WITH_EXPENSES = {
  expenses: { include: { payments: true }, orderBy: { date: "desc" as const } },
} as const;

export function listBudgetLinesWithExpenses(projectId: string) {
  return prisma.budgetLine.findMany({
    where: { projectId },
    orderBy: { category: "asc" },
    include: LINE_WITH_EXPENSES,
  });
}

export function findBudgetLineWithExpenses(projectId: string, id: string) {
  return prisma.budgetLine.findFirst({ where: { id, projectId }, include: LINE_WITH_EXPENSES });
}

export function findBudgetLineShallow(projectId: string, id: string) {
  return prisma.budgetLine.findFirst({ where: { id, projectId } });
}

export function createBudgetLine(projectId: string, data: CreateBudgetLineInput) {
  return prisma.budgetLine.create({
    data: {
      projectId,
      category: data.category,
      plannedAmount: data.plannedAmount,
      committedAmount: data.committedAmount,
    },
  });
}

export function updateBudgetLine(id: string, data: UpdateBudgetLineInput) {
  return prisma.budgetLine.update({
    where: { id },
    data: {
      category: data.category,
      plannedAmount: data.plannedAmount,
      committedAmount: data.committedAmount,
    },
  });
}

export function setVarianceReason(id: string, varianceReason: string) {
  return prisma.budgetLine.update({ where: { id }, data: { varianceReason } });
}

export function createExpense(projectId: string, budgetLineId: string, data: LogExpenseInput) {
  return prisma.expense.create({
    data: {
      projectId,
      budgetLineId,
      description: data.description,
      amount: data.amount,
      date: data.date ?? new Date(),
      orderId: data.orderId,
      source: "manual",
    },
  });
}

/**
 * הזמנות הקשורות לרשימת Expense-ים (לגילוי סתירה בין הוצאה להזמנה שהיא
 * מבוססת עליה - ספק 8.6). קריאה בלבד ל-Order, לא ייבוא של פיצ'ר אחר.
 */
export function findOrdersByIds(orderIds: string[]) {
  if (orderIds.length === 0) return Promise.resolve([]);
  return prisma.order.findMany({
    where: { id: { in: orderIds } },
    select: { id: true, number: true, totalAmount: true },
  });
}
