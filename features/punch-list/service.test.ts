import { describe, expect, it } from "vitest";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";
import * as service from "./service";

async function seedDefect() {
  const owner = await createTestUser();
  const project = await createTestProject(owner.id);
  const defect = await service.createDefect(owner.id, project.id, {
    title: "אריח סדוק",
    description: "אריח בסלון נסדק בזמן ההובלה",
  });
  return { owner, project, defect };
}

describe("resolveDefect / closeDefect - נפתר אינו נסגר", () => {
  it("דורשת resolutionNotes לא ריקות כדי לסמן כנפתר", async () => {
    const { owner, project, defect } = await seedDefect();
    await expect(service.resolveDefect(owner.id, project.id, defect.id, { resolutionNotes: "" })).rejects.toThrow();
  });

  it("אחרי סימון כנפתר הסטטוס RESOLVED, לא CLOSED", async () => {
    const { owner, project, defect } = await seedDefect();
    const resolved = await service.resolveDefect(owner.id, project.id, defect.id, { resolutionNotes: "הוחלף האריח" });
    expect(resolved.status).toBe("RESOLVED");
  });

  it("לא ניתן לאשר סגירה לפני שסומן כנפתר", async () => {
    const { owner, project, defect } = await seedDefect();
    await expect(service.closeDefect(owner.id, project.id, defect.id, { closingNote: "אושר" })).rejects.toThrow();
  });

  it("אישור סגירה אפשרי אחרי RESOLVED, ושומר גם את הערת התיקון וגם את הערת הסגירה", async () => {
    const { owner, project, defect } = await seedDefect();
    await service.resolveDefect(owner.id, project.id, defect.id, { resolutionNotes: "הוחלף האריח" });
    const closed = await service.closeDefect(owner.id, project.id, defect.id, { closingNote: "נבדק ואושר" });

    expect(closed.status).toBe("CLOSED");
    expect(closed.resolutionNotes).toContain("הוחלף האריח");
    expect(closed.resolutionNotes).toContain("נבדק ואושר");
  });

  it("אישור סגירה אפשרי גם אחרי מעבר ל-IN_REVIEW", async () => {
    const { owner, project, defect } = await seedDefect();
    await service.resolveDefect(owner.id, project.id, defect.id, { resolutionNotes: "הוחלף האריח" });
    await service.sendDefectForReview(owner.id, project.id, defect.id);
    const closed = await service.closeDefect(owner.id, project.id, defect.id, { closingNote: "אושר בסיור" });
    expect(closed.status).toBe("CLOSED");
  });
});

describe("sendDefectForReview", () => {
  it("אפשרי רק מ-RESOLVED", async () => {
    const { owner, project, defect } = await seedDefect();
    await expect(service.sendDefectForReview(owner.id, project.id, defect.id)).rejects.toThrow();
  });
});
