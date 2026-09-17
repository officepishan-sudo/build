import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { ForbiddenError, NotFoundError } from "@/lib/errors";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";
import { createDocument, deleteDocument, listDocuments, updateDocument } from "./service";

describe("documents service", () => {
  it("דוחה יצירת מסמך למי שאין לו גישה לפרויקט", async () => {
    const owner = await createTestUser();
    const stranger = await createTestUser();
    const project = await createTestProject(owner.id);

    await expect(
      createDocument(stranger.id, project.id, { category: "חוזים", name: "חוזה" }),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("שומרת מסמך בלי קישור כ'קובץ חסר' בלי להמציא URL", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);

    const doc = await createDocument(owner.id, project.id, { category: "אישורים", name: "היתר בנייה" });

    expect(doc.fileUrl).toBe("");
  });

  it("מסננת רשימת מסמכים לפי קטגוריה", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    await createDocument(owner.id, project.id, { category: "חוזים", name: "חוזה קבלן" });
    await createDocument(owner.id, project.id, { category: "חשבוניות", name: "חשבונית 1" });

    const contracts = await listDocuments(owner.id, project.id, "חוזים");

    expect(contracts).toHaveLength(1);
    expect(contracts[0]?.name).toBe("חוזה קבלן");
  });

  it("זורקת NotFoundError בעריכת מסמך שלא קיים בפרויקט", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);

    await expect(
      updateDocument(owner.id, project.id, "missing-id", { category: "חוזים", name: "x" }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("דוחה מחיקת מסמך למשתמש ברמת VIEW בלבד", async () => {
    const owner = await createTestUser();
    const viewer = await createTestUser();
    const project = await createTestProject(owner.id);
    await prisma.projectShare.create({ data: { projectId: project.id, userId: viewer.id, level: "VIEW" } });
    const doc = await createDocument(owner.id, project.id, { category: "חוזים", name: "חוזה" });

    await expect(deleteDocument(viewer.id, project.id, doc.id)).rejects.toBeInstanceOf(ForbiddenError);
  });
});
