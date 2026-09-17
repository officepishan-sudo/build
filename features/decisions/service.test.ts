import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { ForbiddenError, NotFoundError } from "@/lib/errors";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";
import * as service from "./service";

describe("features/decisions service", () => {
  describe("createDecision", () => {
    it("יוצרת החלטה חדשה במצב OPEN עבור בעל הפרויקט", async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id);

      const decision = await service.createDecision(owner.id, project.id, {
        title: "איזה ריצוף לבחור",
        description: "פורצלן מול קרמיקה",
      });

      expect(decision.status).toBe("OPEN");
      expect(decision.title).toBe("איזה ריצוף לבחור");
    });

    it("דוחה משתמש בלי גישה מספקת (VIEW לא מספיק ל-DECIDE)", async () => {
      const owner = await createTestUser();
      const viewer = await createTestUser();
      const project = await createTestProject(owner.id);
      await prisma.projectShare.create({ data: { projectId: project.id, userId: viewer.id, level: "VIEW" } });

      await expect(service.createDecision(viewer.id, project.id, { title: "משהו" })).rejects.toBeInstanceOf(
        ForbiddenError,
      );
    });

    it("זורקת שגיאת ולידציה כשאין כותרת", async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id);

      await expect(service.createDecision(owner.id, project.id, { title: "" })).rejects.toThrow();
    });
  });

  describe("markDecided", () => {
    it("מסמנת החלטה כהוחלטה עם ערך מפורש", async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id);
      const decision = await service.createDecision(owner.id, project.id, { title: "צבע קירות" });

      const updated = await service.markDecided(owner.id, project.id, decision.id, {
        decidedValue: "לבן שבור",
      });

      expect(updated.status).toBe("DECIDED");
      expect(updated.decidedValue).toBe("לבן שבור");
      expect(updated.decidedAt).not.toBeNull();
    });

    it('Edge case: "לא יודע"/ערך ריק לא סוגר החלטה - נדחה עם שגיאת ולידציה', async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id);
      const decision = await service.createDecision(owner.id, project.id, { title: "צבע קירות" });

      await expect(
        service.markDecided(owner.id, project.id, decision.id, { decidedValue: "" }),
      ).rejects.toThrow();

      const stillOpen = await prisma.decision.findUnique({ where: { id: decision.id } });
      expect(stillOpen?.status).toBe("OPEN");
    });

    it("זורקת NotFoundError להחלטה שלא קיימת בפרויקט", async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id);

      await expect(
        service.markDecided(owner.id, project.id, "missing-id", { decidedValue: "ערך" }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("markNeedsCheck", () => {
    it('Edge case: "לא יודע" עובר ל-NEEDS_CHECK, לעולם לא DECIDED בלי ערך', async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id);
      const decision = await service.createDecision(owner.id, project.id, { title: "ספק ריהוט" });

      const updated = await service.markNeedsCheck(owner.id, project.id, decision.id);

      expect(updated.status).toBe("NEEDS_CHECK");
      expect(updated.decidedValue).toBeNull();
      expect(updated.decidedAt).toBeNull();
    });
  });

  describe("markOpen", () => {
    it('"השאר פתוח" מחזירה החלטה שסומנה כדורשת בדיקה למצב פתוח, בלי לאבד את המצב', async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id);
      const decision = await service.createDecision(owner.id, project.id, { title: "ספק ריהוט" });
      await service.markNeedsCheck(owner.id, project.id, decision.id);

      const reopened = await service.markOpen(owner.id, project.id, decision.id);

      expect(reopened.status).toBe("OPEN");
    });
  });

  describe("getOpenDecisionsSummary", () => {
    it("מחזירה מונה ורשימת החלטות פתוחות בלבד, ממוינות לפי דדליין", async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id);
      const far = await service.createDecision(owner.id, project.id, {
        title: "מרוחקת",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      const near = await service.createDecision(owner.id, project.id, {
        title: "קרובה",
        deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      });
      const decided = await service.createDecision(owner.id, project.id, { title: "כבר הוחלטה" });
      await service.markDecided(owner.id, project.id, decided.id, { decidedValue: "כן" });

      const summary = await service.getOpenDecisionsSummary(owner.id, project.id);

      expect(summary.count).toBe(2);
      expect(summary.items.map((d) => d.id)).toEqual([near.id, far.id]);
    });
  });
});
