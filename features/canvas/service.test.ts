import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { ForbiddenError, NotFoundError } from "@/lib/errors";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";
import * as service from "./service";

describe("features/canvas service", () => {
  describe("setBaseImage + createPin", () => {
    it("קובעת תמונת בסיס ומחילה אותה על פינים חדשים", async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id);

      await service.setBaseImage(owner.id, project.id, { imageUrl: "https://example.com/plan.png" });
      const pin = await service.createPin(owner.id, project.id, { x: 10, y: 20, label: "חלון" });

      expect(pin.imageUrl).toBe("https://example.com/plan.png");
    });

    it("מאפשרת יצירת פין גם בלי תמונת בסיס (מצב 'בלי קנבס')", async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id);

      const pin = await service.createPin(owner.id, project.id, { x: 50, y: 50, label: "הערה כללית" });

      expect(pin.imageUrl).toBeNull();
    });

    it("שינוי תמונת בסיס מעדכן גם פינים קיימים כדי שלא ייווצר פיצול", async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id);
      const pin = await service.createPin(owner.id, project.id, { x: 1, y: 1, label: "לפני" });

      await service.setBaseImage(owner.id, project.id, { imageUrl: "https://example.com/new.png" });

      const updated = await prisma.canvasElement.findUnique({ where: { id: pin.id } });
      expect(updated?.imageUrl).toBe("https://example.com/new.png");
    });

    it("דוחה משתמש בלי גישת DECIDE ומעלה", async () => {
      const owner = await createTestUser();
      const viewer = await createTestUser();
      const project = await createTestProject(owner.id);
      await prisma.projectShare.create({ data: { projectId: project.id, userId: viewer.id, level: "VIEW" } });

      await expect(service.createPin(viewer.id, project.id, { x: 1, y: 1, label: "x" })).rejects.toBeInstanceOf(
        ForbiddenError,
      );
    });
  });

  describe("updatePin / deletePin", () => {
    it("מעדכנת פין קיים", async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id);
      const pin = await service.createPin(owner.id, project.id, { x: 1, y: 1, label: "ישן" });

      const updated = await service.updatePin(owner.id, project.id, pin.id, { x: 5, y: 5, label: "חדש" });

      expect(updated.label).toBe("חדש");
    });

    it("זורקת NotFoundError לפין שלא קיים בפרויקט", async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id);

      await expect(
        service.updatePin(owner.id, project.id, "missing-id", { x: 1, y: 1, label: "x" }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("מוחקת פין קיים", async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id);
      const pin = await service.createPin(owner.id, project.id, { x: 1, y: 1, label: "למחיקה" });

      await service.deletePin(owner.id, project.id, pin.id);

      const found = await prisma.canvasElement.findUnique({ where: { id: pin.id } });
      expect(found).toBeNull();
    });
  });
});
