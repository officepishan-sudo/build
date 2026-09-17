import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";
import * as service from "./service";

async function createTestProfessional() {
  return prisma.professional.create({ data: { name: "בעל מקצוע בדיקה", fields: ["קבלן כללי"], area: "מרכז" } });
}

describe("createQuote", () => {
  it("מחשבת ושומרת gapVsEstimate מול סכום כתב הכמויות", async () => {
    const user = await createTestUser();
    const project = await createTestProject(user.id);
    const professional = await createTestProfessional();
    await prisma.quantityItem.create({
      data: { projectId: project.id, category: "חשמל", description: "לוח חשמל", quantity: 1, unit: "יח", totalCost: 1000 },
    });

    const quote = await service.createQuote(user.id, project.id, { price: "1200", professionalId: professional.id });

    expect(Number(quote.gapVsEstimate)).toBe(200);
  });

  it("משאירה gapVsEstimate ריק כשאין כלל שורות אומדן בפרויקט", async () => {
    const user = await createTestUser();
    const project = await createTestProject(user.id);
    const professional = await createTestProfessional();

    const quote = await service.createQuote(user.id, project.id, { price: "1200", professionalId: professional.id });

    expect(quote.gapVsEstimate).toBeNull();
  });
});

describe("selectQuote / rejectQuote", () => {
  it("בחירת הצעה מעדכנת סטטוס ל-SELECTED ויוצרת Decision", async () => {
    const user = await createTestUser();
    const project = await createTestProject(user.id);
    const professional = await createTestProfessional();
    const quote = await service.createQuote(user.id, project.id, { price: "500", professionalId: professional.id });

    await service.selectQuote(user.id, project.id, quote.id);

    const updated = await prisma.quote.findUnique({ where: { id: quote.id } });
    const decisions = await prisma.decision.findMany({ where: { projectId: project.id, sourceId: quote.id } });
    expect(updated?.status).toBe("SELECTED");
    expect(decisions).toHaveLength(1);
  });

  it("דחיית הצעה מעדכנת סטטוס ל-REJECTED בלי לגעת בהצעות אחרות", async () => {
    const user = await createTestUser();
    const project = await createTestProject(user.id);
    const professional = await createTestProfessional();
    const quoteA = await service.createQuote(user.id, project.id, { price: "500", professionalId: professional.id });
    const quoteB = await service.createQuote(user.id, project.id, { price: "600", professionalId: professional.id });

    await service.rejectQuote(user.id, project.id, quoteA.id);

    const a = await prisma.quote.findUnique({ where: { id: quoteA.id } });
    const b = await prisma.quote.findUnique({ where: { id: quoteB.id } });
    expect(a?.status).toBe("REJECTED");
    expect(b?.status).toBe("RECEIVED");
  });
});
