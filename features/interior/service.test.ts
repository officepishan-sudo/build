import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { ForbiddenError, NotFoundError } from "@/lib/errors";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";
import * as service from "./service";

describe("features/interior service", () => {
  describe("createRoom / listRooms", () => {
    it("יוצרת חדר ומחזירה אותו עם רשימת פריטים ריקה", async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id);

      await service.createRoom(owner.id, project.id, { name: "סלון" });
      const rooms = await service.listRooms(owner.id, project.id);

      expect(rooms).toHaveLength(1);
      expect(rooms[0]?.items).toEqual([]);
    });

    it("דוחה משתמש בלי גישת DECIDE ומעלה", async () => {
      const owner = await createTestUser();
      const viewer = await createTestUser();
      const project = await createTestProject(owner.id);
      await prisma.projectShare.create({ data: { projectId: project.id, userId: viewer.id, level: "VIEW" } });

      await expect(service.createRoom(viewer.id, project.id, { name: "סלון" })).rejects.toBeInstanceOf(
        ForbiddenError,
      );
    });
  });

  describe("createItem", () => {
    it("מוסיפה פריט לחדר קיים", async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id);
      const room = await service.createRoom(owner.id, project.id, { name: "מטבח" });

      const item = await service.createItem(owner.id, project.id, room.id, {
        category: "ריהוט",
        decisionText: "ארון עליון לבן",
        quantity: 2,
      });

      expect(item.category).toBe("ריהוט");
    });

    it("זורקת NotFoundError לחדר שלא קיים בפרויקט", async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id);

      await expect(
        service.createItem(owner.id, project.id, "missing-id", { category: "תאורה" }),
      ).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("deleteRoom", () => {
    it("מוחקת חדר קיים (ומפילה את הפריטים בו דרך cascade בסכימה)", async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id);
      const room = await service.createRoom(owner.id, project.id, { name: "חדר שינה" });

      await service.deleteRoom(owner.id, project.id, room.id);

      const found = await prisma.room.findUnique({ where: { id: room.id } });
      expect(found).toBeNull();
    });
  });
});
