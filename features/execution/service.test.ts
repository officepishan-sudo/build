import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";
import * as service from "./service";

describe("updateTaskStatus", () => {
  it("מעדכנת סטטוס משימה השייכת לפרויקט", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const phase = await prisma.phase.create({ data: { projectId: project.id, name: "יסודות" } });
    const task = await prisma.task.create({ data: { projectId: project.id, phaseId: phase.id, title: "יציקה" } });

    const updated = await service.updateTaskStatus(owner.id, project.id, task.id, { status: "IN_PROGRESS" });

    expect(updated.status).toBe("IN_PROGRESS");
  });

  it("זורקת NotFoundError כשהמשימה שייכת לפרויקט אחר", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const otherProject = await createTestProject(owner.id);
    const task = await prisma.task.create({ data: { projectId: otherProject.id, title: "משימה" } });

    await expect(
      service.updateTaskStatus(owner.id, project.id, task.id, { status: "DONE" }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
