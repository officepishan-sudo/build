import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { requireProjectAccess, listAccessibleProjectIds } from "./rbac";
import { ForbiddenError, NotFoundError } from "@/lib/errors";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";

describe("requireProjectAccess", () => {
  it("מעניק גישת OWNER לבעל הפרויקט", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);

    const access = await requireProjectAccess(project.id, owner.id, "VIEW");

    expect(access.level).toBe("OWNER");
  });

  it("דוחה משתמש בלי שיתוף כלל", async () => {
    const owner = await createTestUser();
    const stranger = await createTestUser();
    const project = await createTestProject(owner.id);

    await expect(requireProjectAccess(project.id, stranger.id, "VIEW")).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("דוחה כשרמת השיתוף נמוכה מהנדרש (VIEW לא מספיק ל-MANAGE)", async () => {
    const owner = await createTestUser();
    const viewer = await createTestUser();
    const project = await createTestProject(owner.id);
    await prisma.projectShare.create({ data: { projectId: project.id, userId: viewer.id, level: "VIEW" } });

    await expect(requireProjectAccess(project.id, viewer.id, "MANAGE")).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("מאשרת כשרמת השיתוף מספיקה בדיוק", async () => {
    const owner = await createTestUser();
    const manager = await createTestUser();
    const project = await createTestProject(owner.id);
    await prisma.projectShare.create({ data: { projectId: project.id, userId: manager.id, level: "MANAGE" } });

    const access = await requireProjectAccess(project.id, manager.id, "MANAGE");

    expect(access.level).toBe("MANAGE");
  });

  it("זורקת NotFoundError לפרויקט שלא קיים", async () => {
    const user = await createTestUser();
    await expect(requireProjectAccess("missing-id", user.id, "VIEW")).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("listAccessibleProjectIds", () => {
  it("מחזירה גם פרויקטים בבעלות וגם משותפים, בלי כפילויות", async () => {
    const owner = await createTestUser();
    const owned = await createTestProject(owner.id);
    const sharedProject = await createTestProject(owner.id);

    const collaborator = await createTestUser();
    await prisma.projectShare.create({ data: { projectId: sharedProject.id, userId: collaborator.id, level: "COMMENT" } });

    const ids = await listAccessibleProjectIds(collaborator.id);

    expect(ids).toEqual([sharedProject.id]);
    expect(ids).not.toContain(owned.id);
  });
});
