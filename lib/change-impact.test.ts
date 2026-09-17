import { describe, expect, it } from "vitest";
import { computeChangeImpact } from "./change-impact";
import { createTestProject, createTestUser } from "../tests/helpers/factories";
import {
  createTestOrder,
  createTestPayment,
  createTestPhase,
  createTestQuantityItem,
  createTestQuote,
  createTestRequirement,
  createTestTask,
} from "../tests/helpers/change-impact-factories";

describe("computeChangeImpact", () => {
  it("מחזיר תוצאה ריקה כשלא מציינים שום ישות מושפעת", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);

    const result = await computeChangeImpact({ projectId: project.id, changeDescription: "בדיקה" });

    expect(result.affectedRequirements).toEqual([]);
    expect(result.quotesNoLongerValid).toEqual([]);
    expect(result.needsReviewCount).toBe(0);
    expect(result.hasIrreversibleFacts).toBe(false);
  });

  it("לעולם לא מסיר דרישה שסומנה 'דורש בדיקה' - היא מופיעה ונספרת בביקורת", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const requirement = await createTestRequirement(project.id, { status: "NEEDS_CHECK" });

    const result = await computeChangeImpact({
      projectId: project.id,
      changeDescription: "שינוי דרישה",
      affectedRequirementIds: [requirement.id],
    });

    expect(result.affectedRequirements).toHaveLength(1);
    expect(result.affectedRequirements.at(0)?.status).toBe("NEEDS_CHECK");
    expect(result.needsReviewCount).toBe(1);
  });

  it("לפני הזמנה (רק הצעות): מסמן הצעות פתוחות כדורשות הצעה מחודשת", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const openQuote = await createTestQuote(project.id, "SELECTED");
    const rejectedQuote = await createTestQuote(project.id, "REJECTED");

    const result = await computeChangeImpact({
      projectId: project.id,
      changeDescription: "שינוי בסעיף",
      affectedQuoteIds: [openQuote.id, rejectedQuote.id],
    });

    expect(result.quotesNoLongerValid.map((q) => q.id)).toEqual([openQuote.id]);
    expect(result.needsReviewCount).toBe(1);
  });

  it("אחרי הזמנה שכבר בביצוע: מציג כעובדה שכבר קרתה, לא כמשהו שניתן לבטל בשקט", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const inProgressOrder = await createTestOrder(project.id, "IN_PROGRESS");
    const draftOrder = await createTestOrder(project.id, "DRAFT");

    const result = await computeChangeImpact({
      projectId: project.id,
      changeDescription: "שינוי בהזמנה",
      affectedOrderIds: [inProgressOrder.id, draftOrder.id],
    });

    const committed = result.ordersWithCommitments.find((o) => o.id === inProgressOrder.id);
    const draft = result.ordersWithCommitments.find((o) => o.id === draftOrder.id);
    expect(committed?.alreadyHappened).toBe(true);
    expect(committed?.clarificationNeeded).toMatch(/לא ניתן לבטל בשקט/);
    expect(draft?.alreadyHappened).toBe(false);
    expect(result.hasIrreversibleFacts).toBe(true);
    // הזמנה שכבר בביצוע לא נספרת כ"ממתינה להחלטה" - היא כבר עובדה קיימת.
    expect(result.needsReviewCount).toBe(1);
  });

  it("אחרי תשלום: מציג מה שולם בלי שינוי חשבונאי שקט - אף כתיבה לא מתבצעת כאן", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const order = await createTestOrder(project.id, "CONFIRMED");
    const payment = await createTestPayment(project.id, { orderId: order.id, status: "PAID" });
    const pendingPayment = await createTestPayment(project.id, { orderId: order.id, status: "PENDING" });

    const result = await computeChangeImpact({
      projectId: project.id,
      changeDescription: "שינוי שמשפיע על הזמנה ששולמה",
      affectedOrderIds: [order.id],
    });

    expect(result.paymentsAlreadyMade.map((p) => p.id)).toEqual([payment.id]);
    expect(result.paymentsAlreadyMade.map((p) => p.id)).not.toContain(pendingPayment.id);
    expect(result.hasIrreversibleFacts).toBe(true);
  });

  it("אחרי ביצוע: משימה שכבר DONE מוצגת כמה שכבר קרה, לא נעלמת", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const phase = await createTestPhase(project.id);
    const item = await createTestQuantityItem(project.id, { phaseId: phase.id });
    const doneTask = await createTestTask(project.id, phase.id, "DONE");
    await createTestTask(project.id, phase.id, "NOT_STARTED");

    const result = await computeChangeImpact({
      projectId: project.id,
      changeDescription: "שינוי בסעיף עם עבודה שכבר בוצעה",
      affectedQuantityItemIds: [item.id],
    });

    expect(result.tasksAlreadyDone.map((t) => t.id)).toEqual([doneTask.id]);
    expect(result.hasIrreversibleFacts).toBe(true);
  });
});
