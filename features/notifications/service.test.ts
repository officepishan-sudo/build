import { describe, expect, it } from "vitest";
import { ForbiddenError, NotFoundError } from "@/lib/errors";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";
import { createNotification, listMyNotifications, markNotificationRead } from "./service";

describe("notifications service", () => {
  it("מחזירה רק את ההתראות של המשתמש המחובר, מכל הפרויקטים שלו", async () => {
    const owner = await createTestUser();
    const stranger = await createTestUser();
    const project = await createTestProject(owner.id);
    const otherProject = await createTestProject(owner.id);
    await createNotification({ projectId: project.id, userId: owner.id, title: "כותרת", body: "תוכן" });
    await createNotification({ projectId: otherProject.id, userId: owner.id, title: "כותרת 2", body: "תוכן 2" });
    await createNotification({ projectId: project.id, userId: stranger.id, title: "לא שלי", body: "תוכן" });

    const notifications = await listMyNotifications(owner.id);

    expect(notifications).toHaveLength(2);
  });

  it("דוחה יצירת התראה בלי body (כל התראה חייבת סיבה)", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);

    await expect(
      createNotification({ projectId: project.id, userId: owner.id, title: "כותרת", body: "" }),
    ).rejects.toThrow();
  });

  it("מסמנת התראה כנקראה רק עבור הבעלים שלה", async () => {
    const owner = await createTestUser();
    const stranger = await createTestUser();
    const project = await createTestProject(owner.id);
    const notification = await createNotification({
      projectId: project.id,
      userId: owner.id,
      title: "כותרת",
      body: "תוכן",
    });

    const updated = await markNotificationRead(owner.id, notification.id);
    expect(updated.isRead).toBe(true);

    await expect(markNotificationRead(stranger.id, notification.id)).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("זורקת NotFoundError על התראה שלא קיימת", async () => {
    const owner = await createTestUser();
    await expect(markNotificationRead(owner.id, "missing-id")).rejects.toBeInstanceOf(NotFoundError);
  });
});
