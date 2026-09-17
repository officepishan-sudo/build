import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { ForbiddenError } from "@/lib/errors";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";
import { createTestOrder } from "../../tests/helpers/change-impact-factories";
import { approveChange, reviewChangeImpact } from "./service";

describe("change-impact service", () => {
  it("מחזירה פירוט השפעה לגישת VIEW ומעלה", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const order = await createTestOrder(project.id, "IN_PROGRESS");

    const result = await reviewChangeImpact(owner.id, project.id, {
      changeDescription: "בדיקה",
      affectedOrderIds: order.id,
    });

    expect(result.ordersWithCommitments).toHaveLength(1);
    expect(result.ordersWithCommitments.at(0)?.alreadyHappened).toBe(true);
  });

  it("אישור שינוי דורש הרשאת MANAGE ולא רק VIEW", async () => {
    const owner = await createTestUser();
    const viewer = await createTestUser();
    const project = await createTestProject(owner.id);
    await prisma.projectShare.create({ data: { projectId: project.id, userId: viewer.id, level: "VIEW" } });

    await expect(
      approveChange(viewer.id, project.id, { changeDescription: "שינוי", reason: "כי כן צריך" }),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("אישור שינוי תמיד יוצר VersionSnapshot עם הסיבה ומי אישר - אף פעם לא שקט", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);

    await approveChange(owner.id, project.id, { changeDescription: "הרחבת מרפסת", reason: "אושר בפגישה עם הקבלן" });

    const snapshots = await prisma.versionSnapshot.findMany({ where: { projectId: project.id, entityType: "ChangeImpactReview" } });
    expect(snapshots).toHaveLength(1);
    expect(snapshots.at(0)?.reason).toBe("אושר בפגישה עם הקבלן");
    expect(snapshots.at(0)?.createdByUserId).toBe(owner.id);
    expect(snapshots.at(0)?.dataAfter).not.toBeNull();
  });
});
