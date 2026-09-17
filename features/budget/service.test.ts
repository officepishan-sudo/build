import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";
import * as service from "./service";

// עוזרי בדיקה מקומיים לפיצ'ר הזה בלבד (לא נוגעים ב-tests/helpers/factories.ts
// המשותף, כדי לא להתנגש עם סוכנים אחרים שעובדים במקביל על אותו ריפו).
async function seedProjectWithLine(plannedAmount = 1000) {
  const owner = await createTestUser();
  const project = await createTestProject(owner.id);
  const line = await prisma.budgetLine.create({
    data: { projectId: project.id, category: "אינסטלציה", plannedAmount },
  });
  return { owner, project, line };
}

describe("listBudgetOverview / getBudgetLineDetail - actualAmount נגזר מ-Expense", () => {
  it("בפועל מחושב כסכום ה-Expense-ים, לא מהשדה השמור actualAmount", async () => {
    const { owner, project, line } = await seedProjectWithLine(1000);

    await prisma.expense.create({
      data: { projectId: project.id, budgetLineId: line.id, description: "צנרת", amount: 300 },
    });

    const overview = await service.listBudgetOverview(owner.id, project.id);
    expect(overview.lines).toHaveLength(1);
    const [summary] = overview.lines;
    expect(summary?.actual).toBe(300);
    expect(summary?.remaining).toBe(700);
    // השדה actualAmount בטבלה אמור להישאר 0 - לא נכתב אליו כלל.
    const raw = await prisma.budgetLine.findUniqueOrThrow({ where: { id: line.id } });
    expect(Number(raw.actualAmount)).toBe(0);
  });

  it("הוספת הוצאה נוספת מעדכנת את הסכום מיידית בקריאה הבאה", async () => {
    const { owner, project, line } = await seedProjectWithLine(1000);

    await service.logExpense(owner.id, project.id, line.id, { description: "צנרת", amount: 300 });
    const after1 = await service.getBudgetLineDetail(owner.id, project.id, line.id);
    expect(after1.summary.actual).toBe(300);

    await service.logExpense(owner.id, project.id, line.id, { description: "ברזים", amount: 450 });
    const after2 = await service.getBudgetLineDetail(owner.id, project.id, line.id);
    expect(after2.summary.actual).toBe(750);
    expect(after2.summary.expenseCount).toBe(2);
  });

  it("שורה בלי הוצאות מוצגת כ'מתוכנן בלבד' ובלי חריגה", async () => {
    const { owner, project, line } = await seedProjectWithLine(500);
    const detail = await service.getBudgetLineDetail(owner.id, project.id, line.id);
    expect(detail.summary.hasActualYet).toBe(false);
    expect(detail.summary.isOverageUnexplained).toBe(false);
  });

  it("חריגה בלי הסבר מסומנת isOverageUnexplained, ונעלמת אחרי קביעת varianceReason", async () => {
    const { owner, project, line } = await seedProjectWithLine(100);
    await service.logExpense(owner.id, project.id, line.id, { description: "תוספת בלתי צפויה", amount: 250 });

    const before = await service.getBudgetLineDetail(owner.id, project.id, line.id);
    expect(before.summary.isOverageUnexplained).toBe(true);
    expect(before.summary.variance).toBe(150);

    await service.setVarianceReason(owner.id, project.id, line.id, { varianceReason: "עליית מחירי נחושת" });
    const after = await service.getBudgetLineDetail(owner.id, project.id, line.id);
    expect(after.summary.isOverageUnexplained).toBe(false);
  });

  it("מסרבת לגישה למי שאינו משתתף בפרויקט", async () => {
    const { project } = await seedProjectWithLine();
    const stranger = await createTestUser();
    await expect(service.listBudgetOverview(stranger.id, project.id)).rejects.toThrow();
  });
});

describe("getBudgetLineDetail - זיהוי סתירה מול הזמנה (ספק 8.6)", () => {
  it("מסמנת קונפליקט כשסכום ההוצאות המקושרות להזמנה שונה מסכום ההזמנה", async () => {
    const { owner, project, line } = await seedProjectWithLine(1000);
    const order = await prisma.order.create({
      data: { projectId: project.id, number: "ORD-1", totalAmount: 500 },
    });
    await prisma.expense.create({
      data: { projectId: project.id, budgetLineId: line.id, description: "מתוך הזמנה", amount: 800, orderId: order.id },
    });

    const detail = await service.getBudgetLineDetail(owner.id, project.id, line.id);
    expect(detail.conflicts).toHaveLength(1);
    expect(detail.conflicts[0]).toMatchObject({ orderTotal: 500, expensesTotal: 800 });
  });

  it("לא מסמנת קונפליקט כשההוצאות תואמות את ההזמנה", async () => {
    const { owner, project, line } = await seedProjectWithLine(1000);
    const order = await prisma.order.create({
      data: { projectId: project.id, number: "ORD-2", totalAmount: 500 },
    });
    await prisma.expense.create({
      data: { projectId: project.id, budgetLineId: line.id, description: "מתוך הזמנה", amount: 500, orderId: order.id },
    });

    const detail = await service.getBudgetLineDetail(owner.id, project.id, line.id);
    expect(detail.conflicts).toHaveLength(0);
  });
});

describe("logExpense - תשלום ≠ הוצאה", () => {
  it("רישום הוצאה לא יוצר תשלום באופן שקט", async () => {
    const { owner, project, line } = await seedProjectWithLine(1000);
    await service.logExpense(owner.id, project.id, line.id, { description: "צנרת", amount: 300 });
    const payments = await prisma.payment.findMany({ where: { projectId: project.id } });
    expect(payments).toHaveLength(0);
  });
});
