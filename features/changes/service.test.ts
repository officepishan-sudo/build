import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";
import * as service from "./service";

async function seedChange() {
  const owner = await createTestUser();
  const project = await createTestProject(owner.id);
  const change = await service.createChangeRequest(owner.id, project.id, {
    title: "הוספת חלון",
    reason: "צורך באוורור נוסף",
  });
  return { owner, project, change };
}

describe("מחזור החיים של שינוי", () => {
  it("נפתח כטיוטה (DRAFT)", async () => {
    const { change } = await seedChange();
    expect(change.status).toBe("DRAFT");
  });

  it("לא ניתן לדלג ישר מ-DRAFT לאישור", async () => {
    const { owner, project, change } = await seedChange();
    await expect(service.moveToStatus(owner.id, project.id, change.id, "APPROVAL")).rejects.toThrow();
  });

  it("שינוי לא ברור נשאר ב-CLARIFICATION במקום להידחף ל-PROPOSED", async () => {
    const { owner, project, change } = await seedChange();
    const updated = await service.moveToStatus(owner.id, project.id, change.id, "CLARIFICATION");
    expect(updated.status).toBe("CLARIFICATION");
  });

  it("אישור אפשרי רק משלב APPROVAL, וקובע decidedAt", async () => {
    const { owner, project, change } = await seedChange();
    await expect(service.approveChangeRequest(owner.id, project.id, change.id)).rejects.toThrow();

    await service.moveToStatus(owner.id, project.id, change.id, "PROPOSED");
    await service.moveToStatus(owner.id, project.id, change.id, "APPROVAL");
    const approved = await service.approveChangeRequest(owner.id, project.id, change.id);

    expect(approved.status).toBe("APPROVED");
    expect(approved.decidedAt).not.toBeNull();
  });

  it("מונע עריכת שינוי שכבר הוכרע", async () => {
    const { owner, project, change } = await seedChange();
    await service.moveToStatus(owner.id, project.id, change.id, "PROPOSED");
    await service.moveToStatus(owner.id, project.id, change.id, "APPROVAL");
    await service.approveChangeRequest(owner.id, project.id, change.id);

    await expect(
      service.updateChangeRequestDetails(owner.id, project.id, change.id, { title: "שינוי כותרת", reason: "סיבה" }),
    ).rejects.toThrow();
  });
});

describe("מחיקה - לא מוחקים עבר", () => {
  it("מאפשרת מחיקת טיוטה בלבד", async () => {
    const { owner, project, change } = await seedChange();
    await service.deleteDraftChangeRequest(owner.id, project.id, change.id);
    const found = await prisma.changeRequest.findUnique({ where: { id: change.id } });
    expect(found).toBeNull();
  });

  it("דוחה מחיקה של שינוי שהתקדם - מחייבת ביטול במקום מחיקה", async () => {
    const { owner, project, change } = await seedChange();
    await service.moveToStatus(owner.id, project.id, change.id, "CLARIFICATION");

    await expect(service.deleteDraftChangeRequest(owner.id, project.id, change.id)).rejects.toThrow();
    const stillThere = await prisma.changeRequest.findUnique({ where: { id: change.id } });
    expect(stillThere).not.toBeNull();
  });
});
