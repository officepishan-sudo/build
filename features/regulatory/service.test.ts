import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";
import * as service from "./service";

describe("features/regulatory service", () => {
  describe("getChecklistState", () => {
    it("מציעה 'canSeed' כשיש תבנית מפורסמת שמתאימה לסוג הפרויקט", async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id); // RENOVATION
      await prisma.contentTemplate.create({
        data: {
          type: "CHECKLIST_ITEM",
          key: "renovation-permit",
          status: "PUBLISHED",
          payload: { projectType: "RENOVATION", title: "היתר שיפוץ מהעירייה" },
        },
      });

      const state = await service.getChecklistState(owner.id, project.id);

      expect(state.canSeed).toBe(true);
      expect(state.items).toEqual([]);
    });

    it("לא מציעה seed לתבנית שעדיין בטיוטה (DRAFT) - תוכן לא מפורסם לא זולג לפרויקט", async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id);
      await prisma.contentTemplate.create({
        data: {
          type: "CHECKLIST_ITEM",
          key: "renovation-draft",
          status: "DRAFT",
          payload: { projectType: "RENOVATION", title: "טיוטה" },
        },
      });

      const state = await service.getChecklistState(owner.id, project.id);

      expect(state.canSeed).toBe(false);
    });

    it("מתעלמת בשקט מ-payload פגום בלי לקרוס", async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id);
      await prisma.contentTemplate.create({
        data: { type: "CHECKLIST_ITEM", key: "broken", status: "PUBLISHED", payload: { oops: true } },
      });

      const state = await service.getChecklistState(owner.id, project.id);

      expect(state.canSeed).toBe(false);
    });
  });

  describe("seedChecklist", () => {
    it("יוצרת סעיפים מהתבניות המתאימות לסוג הפרויקט בלבד", async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id); // RENOVATION
      await prisma.contentTemplate.create({
        data: {
          type: "CHECKLIST_ITEM",
          key: "renovation-permit",
          status: "PUBLISHED",
          payload: { projectType: "RENOVATION", title: "היתר שיפוץ" },
        },
      });
      await prisma.contentTemplate.create({
        data: {
          type: "CHECKLIST_ITEM",
          key: "fence-permit",
          status: "PUBLISHED",
          payload: { projectType: "FENCE_GATE", title: "היתר גדר" },
        },
      });

      const items = await service.seedChecklist(owner.id, project.id);

      expect(items).toHaveLength(1);
      expect(items[0].title).toBe("היתר שיפוץ");
    });

    it("לא כופלת סעיפים כשכבר קיימת רשימה", async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id);
      await prisma.regulatoryChecklistItem.create({ data: { projectId: project.id, title: "קיים כבר" } });
      await prisma.contentTemplate.create({
        data: {
          type: "CHECKLIST_ITEM",
          key: "renovation-permit",
          status: "PUBLISHED",
          payload: { projectType: "RENOVATION", title: "היתר שיפוץ" },
        },
      });

      const items = await service.seedChecklist(owner.id, project.id);

      expect(items).toHaveLength(1);
      expect(items[0].title).toBe("קיים כבר");
    });
  });

  describe("updateChecklistItem", () => {
    it("שומרת isChecked והערות בלי להפוך 'לא יודע' ל'לא נדרש' בשקט", async () => {
      const owner = await createTestUser();
      const project = await createTestProject(owner.id);
      const item = await prisma.regulatoryChecklistItem.create({ data: { projectId: project.id, title: "בדיקה" } });

      const updated = await service.updateChecklistItem(owner.id, project.id, item.id, {
        isChecked: false,
        notes: "לא יודע - לבדוק מול הרשות",
      });

      expect(updated.isChecked).toBe(false);
      expect(updated.notes).toBe("לא יודע - לבדוק מול הרשות");
    });
  });
});
