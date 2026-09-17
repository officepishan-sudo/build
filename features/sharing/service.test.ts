import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "@/lib/errors";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";
import { changeShareLevel, inviteUser, listShares, removeShare } from "./service";

describe("sharing service - גבול האבטחה", () => {
  it("מאפשרת לבעלים להזמין משתמש קיים ומחזירה invited", async () => {
    const owner = await createTestUser();
    const target = await createTestUser({ email: "target@example.com" });
    const project = await createTestProject(owner.id);

    const result = await inviteUser(owner.id, project.id, { email: target.email, level: "COMMENT" });

    expect(result.status).toBe("invited");
    const share = await prisma.projectShare.findUnique({
      where: { projectId_userId: { projectId: project.id, userId: target.id } },
    });
    expect(share?.level).toBe("COMMENT");
  });

  it("מחזירה not_registered כשהאימייל לא שייך למשתמש קיים - ולא יוצרת משתמש חדש", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);

    const result = await inviteUser(owner.id, project.id, { email: "nobody@example.com", level: "VIEW" });

    expect(result).toEqual({ status: "not_registered", email: "nobody@example.com" });
    const usersCount = await prisma.user.count({ where: { email: "nobody@example.com" } });
    expect(usersCount).toBe(0);
  });

  it("דוחה הזמנה ממשתמש שאינו OWNER/MANAGE (COMMENT לא מספיק)", async () => {
    const owner = await createTestUser();
    const commenter = await createTestUser();
    const target = await createTestUser({ email: "target2@example.com" });
    const project = await createTestProject(owner.id);
    await prisma.projectShare.create({ data: { projectId: project.id, userId: commenter.id, level: "COMMENT" } });

    await expect(inviteUser(commenter.id, project.id, { email: target.email, level: "VIEW" })).rejects.toBeInstanceOf(
      ForbiddenError,
    );
  });

  it("מאפשרת למשתמש ברמת MANAGE להזמין משתמשים נוספים", async () => {
    const owner = await createTestUser();
    const manager = await createTestUser();
    const target = await createTestUser({ email: "target3@example.com" });
    const project = await createTestProject(owner.id);
    await prisma.projectShare.create({ data: { projectId: project.id, userId: manager.id, level: "MANAGE" } });

    const result = await inviteUser(manager.id, project.id, { email: target.email, level: "DECIDE" });

    expect(result.status).toBe("invited");
  });

  it("דוחה ניסיון לשתף מחדש את בעל הפרויקט עצמו", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);

    await expect(inviteUser(owner.id, project.id, { email: owner.email, level: "MANAGE" })).rejects.toBeInstanceOf(
      ValidationError,
    );
  });

  it("דוחה שיתוף כפול לאותו משתמש (ConflictError)", async () => {
    const owner = await createTestUser();
    const target = await createTestUser({ email: "dup@example.com" });
    const project = await createTestProject(owner.id);
    await prisma.projectShare.create({ data: { projectId: project.id, userId: target.id, level: "VIEW" } });

    await expect(inviteUser(owner.id, project.id, { email: target.email, level: "COMMENT" })).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it("דוחה קלט עם level='OWNER' כבר בשלב הוולידציה (zod)", async () => {
    const owner = await createTestUser();
    const target = await createTestUser({ email: "target4@example.com" });
    const project = await createTestProject(owner.id);

    await expect(
      inviteUser(owner.id, project.id, { email: target.email, level: "OWNER" }),
    ).rejects.toThrow();
  });

  it("מאפשרת ל-VIEW בלבד לצפות ברשימת השיתופים, בלי אפשרות ניהול", async () => {
    const owner = await createTestUser();
    const viewer = await createTestUser();
    const project = await createTestProject(owner.id);
    await prisma.projectShare.create({ data: { projectId: project.id, userId: viewer.id, level: "VIEW" } });

    const result = await listShares(viewer.id, project.id);

    expect(result.canManage).toBe(false);
    expect(result.owner?.name).toBeDefined();
  });

  it("דוחה שינוי רמה וביטול שיתוף למי שאינו MANAGE/OWNER", async () => {
    const owner = await createTestUser();
    const decider = await createTestUser();
    const target = await createTestUser({ email: "target5@example.com" });
    const project = await createTestProject(owner.id);
    await prisma.projectShare.create({ data: { projectId: project.id, userId: decider.id, level: "DECIDE" } });
    const targetShare = await prisma.projectShare.create({
      data: { projectId: project.id, userId: target.id, level: "VIEW" },
    });

    await expect(
      changeShareLevel(decider.id, project.id, targetShare.id, { level: "MANAGE" }),
    ).rejects.toBeInstanceOf(ForbiddenError);
    await expect(removeShare(decider.id, project.id, targetShare.id)).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("מאפשרת ל-MANAGE לשנות רמה ולבטל שיתוף", async () => {
    const owner = await createTestUser();
    const target = await createTestUser({ email: "target6@example.com" });
    const project = await createTestProject(owner.id);
    const share = await prisma.projectShare.create({
      data: { projectId: project.id, userId: target.id, level: "VIEW" },
    });

    const updated = await changeShareLevel(owner.id, project.id, share.id, { level: "MANAGE", domain: "budget" });
    expect(updated.level).toBe("MANAGE");
    expect(updated.domain).toBe("budget");

    await removeShare(owner.id, project.id, share.id);
    const gone = await prisma.projectShare.findUnique({ where: { id: share.id } });
    expect(gone).toBeNull();
  });

  it("זורקת NotFoundError כשמנסים לשנות/לבטל שיתוף שלא שייך לפרויקט הזה", async () => {
    const owner = await createTestUser();
    const otherOwner = await createTestUser();
    const target = await createTestUser({ email: "target7@example.com" });
    const project = await createTestProject(owner.id);
    const otherProject = await createTestProject(otherOwner.id);
    const foreignShare = await prisma.projectShare.create({
      data: { projectId: otherProject.id, userId: target.id, level: "VIEW" },
    });

    await expect(
      changeShareLevel(owner.id, project.id, foreignShare.id, { level: "MANAGE" }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
