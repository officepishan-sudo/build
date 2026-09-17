import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { ForbiddenError } from "@/lib/errors";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";
import { addPhoto, editPhoto, listPhotos } from "./service";

describe("photos service", () => {
  it("דוחה הוספת תמונה למי שאין לו גישה לפרויקט", async () => {
    const owner = await createTestUser();
    const stranger = await createTestUser();
    const project = await createTestProject(owner.id);

    await expect(addPhoto(stranger.id, project.id, { url: "https://example.com/a.jpg" })).rejects.toBeInstanceOf(
      ForbiddenError,
    );
  });

  it("מוסיפה תמונה בלי שלב ומחזירה אותה ברשימה", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);

    await addPhoto(owner.id, project.id, { url: "https://example.com/a.jpg", caption: "יסודות" });
    const photos = await listPhotos(owner.id, project.id);

    expect(photos).toHaveLength(1);
    expect(photos[0]?.phaseId).toBeNull();
  });

  it("מאפשרת עריכה מפורשת של שלב התמונה ולא משנה אותו כתופעת לוואי", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const phase = await prisma.phase.create({ data: { projectId: project.id, name: "יסודות" } });
    const photo = await addPhoto(owner.id, project.id, { url: "https://example.com/a.jpg" });

    expect(photo.phaseId).toBeNull();

    const updated = await editPhoto(owner.id, project.id, photo.id, {
      url: photo.url,
      phaseId: phase.id,
      isBeforeAfter: false,
    });

    expect(updated.phaseId).toBe(phase.id);
  });
});
