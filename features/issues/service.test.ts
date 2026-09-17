import { describe, expect, it } from "vitest";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";
import * as service from "./service";

async function seedIssue() {
  const owner = await createTestUser();
  const project = await createTestProject(owner.id);
  const issue = await service.createIssue(owner.id, project.id, {
    title: "עיכוב באספקה",
    description: "הספק הודיע על עיכוב של שבועיים",
  });
  return { owner, project, issue };
}

describe("resolveIssue / closeIssue", () => {
  it("דורשת הערת פתרון כדי לסמן כנפתרה - לא מאפשרת טקסט ריק", async () => {
    const { owner, project, issue } = await seedIssue();
    await expect(service.resolveIssue(owner.id, project.id, issue.id, { resolutionNote: "" })).rejects.toThrow();
  });

  it("מסמנת כנפתרה עם הערה, ושומרת אותה בשדה impact בלי למחוק תוכן קודם", async () => {
    const { owner, project, issue } = await seedIssue();
    const resolved = await service.resolveIssue(owner.id, project.id, issue.id, {
      resolutionNote: "הספק סיפק בזמן קצר יותר",
    });
    expect(resolved.status).toBe("RESOLVED");
    expect(resolved.impact).toContain("הספק סיפק בזמן קצר יותר");
  });

  it("לא מאפשרת סגירה לפני שהבעיה סומנה כנפתרה", async () => {
    const { owner, project, issue } = await seedIssue();
    await expect(service.closeIssue(owner.id, project.id, issue.id, { resolutionNote: "אושר" })).rejects.toThrow();
  });

  it("מאפשרת סגירה אחרי פתרון, עם הערת סגירה נפרדת", async () => {
    const { owner, project, issue } = await seedIssue();
    await service.resolveIssue(owner.id, project.id, issue.id, { resolutionNote: "תוקן" });
    const closed = await service.closeIssue(owner.id, project.id, issue.id, { resolutionNote: "אושר ע\"י המפקח" });
    expect(closed.status).toBe("CLOSED");
    expect(closed.impact).toContain("תוקן");
    expect(closed.impact).toContain('אושר ע"י המפקח');
  });
});

describe("updateIssueStatus", () => {
  it("דוחה ניסיון לעדכן ל-RESOLVED דרך עדכון הסטטוס הכללי (חייב הערה)", async () => {
    const { owner, project, issue } = await seedIssue();
    await expect(
      service.updateIssueStatus(owner.id, project.id, issue.id, { status: "RESOLVED" }),
    ).rejects.toThrow();
  });

  it("מאפשרת מעבר חופשי בין OPEN/IN_PROGRESS/WAITING", async () => {
    const { owner, project, issue } = await seedIssue();
    const updated = await service.updateIssueStatus(owner.id, project.id, issue.id, { status: "IN_PROGRESS" });
    expect(updated.status).toBe("IN_PROGRESS");
  });
});
