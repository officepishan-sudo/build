import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { ForbiddenError } from "@/lib/errors";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";
import { listMessages, sendMessage } from "./service";

describe("messages service", () => {
  it("דוחה שליחת הודעה למי שאין לו גישה לפרויקט", async () => {
    const owner = await createTestUser();
    const stranger = await createTestUser();
    const project = await createTestProject(owner.id);

    await expect(sendMessage(stranger.id, project.id, { body: "שלום" })).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("דוחה שליחת הודעה ממשתמש ברמת VIEW בלבד", async () => {
    const owner = await createTestUser();
    const viewer = await createTestUser();
    const project = await createTestProject(owner.id);
    await prisma.projectShare.create({ data: { projectId: project.id, userId: viewer.id, level: "VIEW" } });

    await expect(sendMessage(viewer.id, project.id, { body: "שלום" })).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("מאפשרת שליחת הודעה למשתמש ברמת COMMENT ומחזירה אותה ברשימה", async () => {
    const owner = await createTestUser();
    const commenter = await createTestUser();
    const project = await createTestProject(owner.id);
    await prisma.projectShare.create({ data: { projectId: project.id, userId: commenter.id, level: "COMMENT" } });

    await sendMessage(commenter.id, project.id, { body: "יש לי שאלה על ההזמנה" });
    const messages = await listMessages(owner.id, project.id);

    expect(messages).toHaveLength(1);
    expect(messages[0]?.body).toBe("יש לי שאלה על ההזמנה");
  });

  it("מצרפת מסמך חדש כשמצוינים שם וקישור", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);

    const message = await sendMessage(owner.id, project.id, {
      body: "מצורף חוזה מעודכן",
      newDocumentName: "חוזה קבלן",
      newDocumentUrl: "https://example.com/contract.pdf",
    });

    expect(message.attachments).toHaveLength(1);
    expect(message.attachments[0]?.name).toBe("חוזה קבלן");
  });
});
