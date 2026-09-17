import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { ValidationError, ConflictError } from "@/lib/errors";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";
import * as service from "./service";

async function createTestProfessional() {
  return prisma.professional.create({ data: { name: "בעל מקצוע בדיקה", fields: ["חשמלאי"], area: "מרכז" } });
}

const baseInput = { title: "בקשה לבדיקה", scopeText: "", deadline: undefined, recipientProfessionalIds: [] as string[], recipientSupplierIds: [] as string[] };

describe("submitQuoteRequest", () => {
  it("דוחה שליחה בלי נמענים ובלי סעיפים/מפרט", async () => {
    const user = await createTestUser();
    const project = await createTestProject(user.id);

    await expect(service.submitQuoteRequest(user.id, project.id, baseInput, "send")).rejects.toBeInstanceOf(
      ValidationError,
    );
  });

  it("מאפשרת שמירה כטיוטה גם בלי נמענים או סעיפים", async () => {
    const user = await createTestUser();
    const project = await createTestProject(user.id);

    const draft = await service.submitQuoteRequest(user.id, project.id, baseInput, "draft");

    expect(draft.status).toBe("DRAFT");
    expect(draft.sentAt).toBeNull();
  });

  it("שולחת בהצלחה כשיש נמען אחד וסעיפים", async () => {
    const user = await createTestUser();
    const project = await createTestProject(user.id);
    const professional = await createTestProfessional();

    const sent = await service.submitQuoteRequest(
      user.id,
      project.id,
      { ...baseInput, scopeText: "סעיף 1: החלפת לוח חשמל", recipientProfessionalIds: [professional.id] },
      "send",
    );

    expect(sent.status).toBe("SENT");
    expect(sent.sentAt).not.toBeNull();
  });
});

describe("sendDraft / cancelQuoteRequest", () => {
  it("דוחה שליחה חוזרת לבקשה שכבר נשלחה", async () => {
    const user = await createTestUser();
    const project = await createTestProject(user.id);
    const professional = await createTestProfessional();
    const sent = await service.submitQuoteRequest(
      user.id,
      project.id,
      { ...baseInput, scopeText: "סעיף", recipientProfessionalIds: [professional.id] },
      "send",
    );

    await expect(service.sendDraft(user.id, project.id, sent.id)).rejects.toBeInstanceOf(ConflictError);
  });

  it("מבטלת בקשה במצב טיוטה", async () => {
    const user = await createTestUser();
    const project = await createTestProject(user.id);
    const draft = await service.submitQuoteRequest(user.id, project.id, baseInput, "draft");

    const cancelled = await service.cancelQuoteRequest(user.id, project.id, draft.id);

    expect(cancelled.status).toBe("CANCELLED");
  });
});
