import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { ForbiddenError } from "@/lib/errors";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";
import { createTestOrder, createTestQuote } from "../../tests/helpers/change-impact-factories";
import { applyPlayChanges, confirmSelectAlternative, createAlternative, getSelectionImpact, listAlternatives } from "./service";

async function createTestAlternative(projectId: string, overrides: { title?: string } = {}) {
  return prisma.alternative.create({
    data: {
      projectId,
      title: overrides.title ?? "חלופה לבדיקה",
      description: "תיאור",
      priceMin: 1000,
      priceMax: 2000,
      reasonShown: "בדיקה",
    },
  });
}

describe("alternatives service", () => {
  it("יוצרת חלופה חדשה בלי בחירה אוטומטית (never auto-select)", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);

    const alt = await createAlternative(owner.id, project.id, {
      title: "חלופה א",
      description: "תיאור",
      reasonShown: "כי זו הצעה בסיסית",
    });

    expect(alt.isSelected).toBe(false);
  });

  it("דוחה יצירת חלופה למשתמש עם הרשאת VIEW בלבד", async () => {
    const owner = await createTestUser();
    const viewer = await createTestUser();
    const project = await createTestProject(owner.id);
    await prisma.projectShare.create({ data: { projectId: project.id, userId: viewer.id, level: "VIEW" } });

    await expect(
      createAlternative(viewer.id, project.id, { title: "x", description: "y", reasonShown: "z" }),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("בחירת חלופה מבטלת בחירה קודמת ומשאירה VersionSnapshot", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const first = await createTestAlternative(project.id, { title: "ראשונה" });
    const second = await createTestAlternative(project.id, { title: "שנייה" });

    await confirmSelectAlternative(owner.id, project.id, first.id, { reason: "כי כן" });
    await confirmSelectAlternative(owner.id, project.id, second.id, { reason: "שינוי דעה" });

    const refreshedFirst = await prisma.alternative.findUnique({ where: { id: first.id } });
    const refreshedSecond = await prisma.alternative.findUnique({ where: { id: second.id } });
    const snapshots = await prisma.versionSnapshot.findMany({ where: { projectId: project.id, entityType: "Alternative" } });

    expect(refreshedFirst?.isSelected).toBe(false);
    expect(refreshedSecond?.isSelected).toBe(true);
    expect(snapshots).toHaveLength(2);
  });

  it("getSelectionImpact מחזיר null כשאין הצעות/הזמנות בפרויקט", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const alt = await createTestAlternative(project.id);

    const impact = await getSelectionImpact(owner.id, project.id, alt.id);
    expect(impact).toBeNull();
  });

  it("getSelectionImpact מחזיר פירוט כשיש הצעות/הזמנות קיימות בפרויקט", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const alt = await createTestAlternative(project.id);
    await createTestQuote(project.id, "RECEIVED");
    await createTestOrder(project.id, "DRAFT");

    const impact = await getSelectionImpact(owner.id, project.id, alt.id);
    expect(impact).not.toBeNull();
    expect(impact?.quotesNoLongerValid.length).toBe(1);
  });

  it("applyPlayChanges מעדכן את החלופה ושומר VersionSnapshot לפני/אחרי", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const alt = await createTestAlternative(project.id);

    await applyPlayChanges(owner.id, project.id, alt.id, { priceMin: 1500, priceMax: 2500 });

    const updated = await prisma.alternative.findUnique({ where: { id: alt.id } });
    const snapshot = await prisma.versionSnapshot.findFirst({ where: { entityId: alt.id, reason: { contains: "שחק" } } });

    expect(Number(updated?.priceMin)).toBe(1500);
    expect(snapshot).not.toBeNull();
    expect((snapshot?.dataBefore as { priceMin: unknown })?.priceMin?.toString()).toBe("1000");
  });

  it("listAlternatives אינו מסמן אף חלופה כ'מומלצת' - כל השדות ניטרליים", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    await createTestAlternative(project.id, { title: "א" });
    await createTestAlternative(project.id, { title: "ב" });

    const alternatives = await listAlternatives(owner.id, project.id);
    expect(alternatives.every((a) => a.isSelected === false)).toBe(true);
  });
});
