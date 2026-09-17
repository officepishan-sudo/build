import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { ValidationError } from "@/lib/errors";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";
import * as service from "./service";

describe("createDeliveryFromOrder", () => {
  it("יוצרת אספקה מהזמנה עם פרטי ספק/שלב מהוזמנה", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const supplier = await prisma.supplier.create({ data: { name: "ספק", categories: [] } });
    const phase = await prisma.phase.create({ data: { projectId: project.id, name: "גג" } });
    const order = await prisma.order.create({
      data: {
        projectId: project.id,
        number: "ORD-D-1",
        supplierId: supplier.id,
        phaseId: phase.id,
        totalAmount: 50,
        items: { create: [{ description: "רעפים", quantity: 10, unitPrice: 5, totalPrice: 50 }] },
      },
    });

    const delivery = await service.createDeliveryFromOrder(owner.id, project.id, order.id, {
      expectedDate: "2026-10-01",
    });

    expect(delivery.status).toBe("SCHEDULED");
    expect(delivery.supplierId).toBe(supplier.id);
    expect(delivery.phaseId).toBe(phase.id);
    expect(delivery.itemsSummary).toContain("רעפים");
  });
});

describe("updateDeliveryStatus", () => {
  it("דוחה מעבר לא מותר (RECEIVED -> SCHEDULED)", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const delivery = await prisma.delivery.create({ data: { projectId: project.id, status: "RECEIVED" } });

    await expect(
      service.updateDeliveryStatus(owner.id, project.id, delivery.id, "SCHEDULED"),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("מאפשרת מעבר מותר (SCHEDULED -> IN_TRANSIT)", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const delivery = await prisma.delivery.create({ data: { projectId: project.id, status: "SCHEDULED" } });

    const updated = await service.updateDeliveryStatus(owner.id, project.id, delivery.id, "IN_TRANSIT");

    expect(updated.status).toBe("IN_TRANSIT");
  });
});
