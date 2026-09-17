import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";
import * as service from "./service";

describe("createPayment / listPayments", () => {
  it("תיעוד תשלום לא יוצר ולא משנה הוצאה (תשלום ≠ הוצאה)", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const expense = await prisma.expense.create({
      data: { projectId: project.id, description: "צנרת", amount: 500 },
    });

    await service.createPayment(owner.id, project.id, {
      payeeName: "אינסטלטור",
      amount: 500,
      expenseId: expense.id,
    });

    const expenseAfter = await prisma.expense.findUniqueOrThrow({ where: { id: expense.id } });
    expect(Number(expenseAfter.amount)).toBe(500);
    const expensesCount = await prisma.expense.count({ where: { projectId: project.id } });
    expect(expensesCount).toBe(1);
  });

  it("מציגה את תיאור ההוצאה כ'על מה' כשהתשלום מקושר להוצאה", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const expense = await prisma.expense.create({
      data: { projectId: project.id, description: "חשבונית ספק חשמל", amount: 200 },
    });
    await service.createPayment(owner.id, project.id, { payeeName: "חשמלאי", amount: 200, expenseId: expense.id });

    const payments = await service.listPayments(owner.id, project.id);
    expect(payments).toHaveLength(1);
    expect(payments[0]?.subjectLabel).toBe("חשבונית ספק חשמל");
  });
});

describe("markPaymentPaid", () => {
  it("מסמנת תשלום כשולם וקובעת תאריך תשלום", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const payment = await service.createPayment(owner.id, project.id, { payeeName: "קבלן", amount: 1000 });

    await service.markPaymentPaid(owner.id, project.id, payment.id, {});

    const updated = await prisma.payment.findUniqueOrThrow({ where: { id: payment.id } });
    expect(updated.status).toBe("PAID");
    expect(updated.paidDate).not.toBeNull();
  });
});

describe("updatePaymentStatus", () => {
  it("דורשת תאריך תשלום כדי לסמן PAID", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const payment = await service.createPayment(owner.id, project.id, { payeeName: "קבלן", amount: 1000 });

    await expect(
      service.updatePaymentStatus(owner.id, project.id, payment.id, { status: "PAID" }),
    ).rejects.toThrow();
  });

  it("מאפשרת מעבר לסטטוס PARTIAL בלי תאריך תשלום", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const payment = await service.createPayment(owner.id, project.id, { payeeName: "קבלן", amount: 1000 });

    const updated = await service.updatePaymentStatus(owner.id, project.id, payment.id, { status: "PARTIAL" });
    expect(updated.status).toBe("PARTIAL");
  });
});
