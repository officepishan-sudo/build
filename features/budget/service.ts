import { requireProjectAccess } from "@/lib/auth/rbac";
import { NotFoundError } from "@/lib/errors";
import { buildBudgetLineSummary, computeBudgetTotals, type BudgetLineSummary } from "./calc";
import { createBudgetLineSchema, logExpenseSchema, setVarianceReasonSchema, updateBudgetLineSchema } from "./schema";
import * as repo from "./repository";

type LineWithExpenses = NonNullable<Awaited<ReturnType<typeof repo.findBudgetLineWithExpenses>>>;

function toSummary(line: LineWithExpenses): BudgetLineSummary {
  return buildBudgetLineSummary({
    id: line.id,
    category: line.category,
    varianceReason: line.varianceReason,
    planned: Number(line.plannedAmount),
    committed: Number(line.committedAmount),
    expenses: line.expenses.map((e) => ({ amount: Number(e.amount) })),
    payments: line.expenses.flatMap((e) => e.payments).map((p) => ({ amount: Number(p.amount), status: p.status })),
  });
}

export type BudgetOverview = {
  lines: BudgetLineSummary[];
  totals: ReturnType<typeof computeBudgetTotals>;
};

export async function listBudgetOverview(userId: string, projectId: string): Promise<BudgetOverview> {
  await requireProjectAccess(projectId, userId, "VIEW");
  const rows = await repo.listBudgetLinesWithExpenses(projectId);
  const lines = rows.map(toSummary);
  return { lines, totals: computeBudgetTotals(lines) };
}

export type BudgetLineOrderConflict = { orderId: string; orderNumber: string; orderTotal: number; expensesTotal: number };

export type BudgetLineDetail = {
  line: LineWithExpenses;
  summary: BudgetLineSummary;
  conflicts: BudgetLineOrderConflict[];
};

export async function getBudgetLineDetail(userId: string, projectId: string, lineId: string): Promise<BudgetLineDetail> {
  await requireProjectAccess(projectId, userId, "VIEW");
  const line = await requireLine(projectId, lineId);
  const conflicts = await findOrderConflicts(line);
  return { line, summary: toSummary(line), conflicts };
}

// ספק 8.6: הוצאה שלא תואמת את ההזמנה שהיא מבוססת עליה - לא בוחרים מספר אחד
// בשקט, מציגים ConflictBanner עם שני הצדדים.
async function findOrderConflicts(line: LineWithExpenses): Promise<BudgetLineOrderConflict[]> {
  const orderIds = [...new Set(line.expenses.map((e) => e.orderId).filter((id): id is string => Boolean(id)))];
  if (orderIds.length === 0) return [];

  const orders = await repo.findOrdersByIds(orderIds);
  return orders
    .map((order) => {
      const expensesTotal = line.expenses
        .filter((e) => e.orderId === order.id)
        .reduce((sum, e) => sum + Number(e.amount), 0);
      const orderTotal = Number(order.totalAmount);
      return { orderId: order.id, orderNumber: order.number, orderTotal, expensesTotal };
    })
    .filter((c) => Math.abs(c.orderTotal - c.expensesTotal) > 0.5);
}

export async function createBudgetLine(userId: string, projectId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const data = createBudgetLineSchema.parse(input);
  return repo.createBudgetLine(projectId, data);
}

export async function updateBudgetLine(userId: string, projectId: string, lineId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  await requireLineShallow(projectId, lineId);
  const data = updateBudgetLineSchema.parse(input);
  return repo.updateBudgetLine(lineId, data);
}

export async function setVarianceReason(userId: string, projectId: string, lineId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  await requireLineShallow(projectId, lineId);
  const data = setVarianceReasonSchema.parse(input);
  return repo.setVarianceReason(lineId, data.varianceReason);
}

export async function logExpense(userId: string, projectId: string, lineId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  await requireLineShallow(projectId, lineId);
  const data = logExpenseSchema.parse(input);
  return repo.createExpense(projectId, lineId, data);
}

async function requireLine(projectId: string, lineId: string): Promise<LineWithExpenses> {
  const line = await repo.findBudgetLineWithExpenses(projectId, lineId);
  if (!line) throw new NotFoundError("שורת תקציב");
  return line;
}

async function requireLineShallow(projectId: string, lineId: string) {
  const line = await repo.findBudgetLineShallow(projectId, lineId);
  if (!line) throw new NotFoundError("שורת תקציב");
  return line;
}
