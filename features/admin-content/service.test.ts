import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { ConflictError, ForbiddenError, NotFoundError } from "@/lib/errors";
import { createTestUser } from "../../tests/helpers/factories";
import * as service from "./service";

async function makeAdmin(userId: string) {
  await prisma.user.update({ where: { id: userId }, data: { isAdmin: true } });
}

describe("features/admin-content service", () => {
  describe("createTemplate", () => {
    it("יוצרת תבנית DRAFT כברירת מחדל למנהל", async () => {
      const admin = await createTestUser();
      await makeAdmin(admin.id);

      const template = await service.createTemplate(admin.id, {
        type: "CHECKLIST_ITEM",
        key: "renovation-permit",
        payloadText: '{"projectType":"RENOVATION","title":"היתר"}',
      });

      expect(template.status).toBe("DRAFT");
    });

    it("דוחה משתמש שאינו מנהל", async () => {
      const user = await createTestUser();

      await expect(
        service.createTemplate(user.id, { type: "HELP", key: "x", payloadText: "{}" }),
      ).rejects.toBeInstanceOf(ForbiddenError);
    });

    it("דוחה JSON לא תקין בשדה payloadText", async () => {
      const admin = await createTestUser();
      await makeAdmin(admin.id);

      await expect(
        service.createTemplate(admin.id, { type: "HELP", key: "x", payloadText: "{not json" }),
      ).rejects.toThrow();
    });

    it("דוחה יצירת תבנית כפולה (אותו סוג ומפתח)", async () => {
      const admin = await createTestUser();
      await makeAdmin(admin.id);
      await service.createTemplate(admin.id, { type: "HELP", key: "faq-1", payloadText: "{}" });

      await expect(
        service.createTemplate(admin.id, { type: "HELP", key: "faq-1", payloadText: "{}" }),
      ).rejects.toBeInstanceOf(ConflictError);
    });
  });

  describe("updateTemplate / setTemplateStatus", () => {
    it("עריכה ופרסום לא יוצרות רשומה חדשה - אותו id נשאר, רק status/payload מתעדכנים", async () => {
      const admin = await createTestUser();
      await makeAdmin(admin.id);
      const created = await service.createTemplate(admin.id, {
        type: "HELP",
        key: "faq-2",
        payloadText: '{"title":"ישן"}',
      });

      const updated = await service.updateTemplate(admin.id, created.id, {
        type: "HELP",
        key: "faq-2",
        payloadText: '{"title":"חדש"}',
        status: "PUBLISHED",
      });

      expect(updated.id).toBe(created.id);
      expect(updated.status).toBe("PUBLISHED");
      expect(updated.payload).toEqual({ title: "חדש" });
    });

    it("setTemplateStatus מעדכנת סטטוס בלבד", async () => {
      const admin = await createTestUser();
      await makeAdmin(admin.id);
      const created = await service.createTemplate(admin.id, { type: "HELP", key: "faq-3", payloadText: "{}" });

      const published = await service.setTemplateStatus(admin.id, created.id, "PUBLISHED");
      expect(published.status).toBe("PUBLISHED");

      const unpublished = await service.setTemplateStatus(admin.id, created.id, "DRAFT");
      expect(unpublished.status).toBe("DRAFT");
    });

    it("זורקת NotFoundError לתבנית שלא קיימת", async () => {
      const admin = await createTestUser();
      await makeAdmin(admin.id);

      await expect(service.setTemplateStatus(admin.id, "missing-id", "PUBLISHED")).rejects.toBeInstanceOf(
        NotFoundError,
      );
    });
  });

  describe("deleteTemplate", () => {
    it("מוחקת תבנית קיימת", async () => {
      const admin = await createTestUser();
      await makeAdmin(admin.id);
      const created = await service.createTemplate(admin.id, { type: "HELP", key: "faq-4", payloadText: "{}" });

      await service.deleteTemplate(admin.id, created.id);

      const found = await prisma.contentTemplate.findUnique({ where: { id: created.id } });
      expect(found).toBeNull();
    });
  });
});
