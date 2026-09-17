import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { ValidationError } from "@/lib/errors";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";
import * as service from "./service";

async function createSupplier(name = "ספק בדיקה") {
  return prisma.supplier.create({ data: { name, categories: [] } });
}

async function createCartItem(
  projectId: string,
  overrides: { supplierId?: string | null; quantity?: number; unitPrice?: number | null } = {},
) {
  return prisma.cartItem.create({
    data: { projectId, description: "פריט", quantity: 1, unitPrice: 10, ...overrides },
  });
}

describe("createOrdersFromCart", () => {
  it("דוחה יצירת הזמנה כשלפריט חסר ספק", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const item = await createCartItem(project.id, { supplierId: null });

    await expect(
      service.createOrdersFromCart(owner.id, project.id, { cartItemIds: [item.id] }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("דוחה יצירת הזמנה כשהכמות אינה חיובית", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const supplier = await createSupplier();
    const item = await createCartItem(project.id, { supplierId: supplier.id, quantity: 0 });

    await expect(
      service.createOrdersFromCart(owner.id, project.id, { cartItemIds: [item.id] }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("מקבצת פריטים משני ספקים לשתי הזמנות, ומרוקנת את העגלה", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const supplierA = await createSupplier("ספק א");
    const supplierB = await createSupplier("ספק ב");
    const itemA = await createCartItem(project.id, { supplierId: supplierA.id, quantity: 2, unitPrice: 10 });
    const itemB = await createCartItem(project.id, { supplierId: supplierB.id, quantity: 3, unitPrice: 5 });

    const orders = await service.createOrdersFromCart(owner.id, project.id, {
      cartItemIds: [itemA.id, itemB.id],
    });

    expect(orders).toHaveLength(2);
    const remainingCart = await prisma.cartItem.findMany({ where: { projectId: project.id } });
    expect(remainingCart).toHaveLength(0);

    const orderA = orders.find((o) => o.supplierId === supplierA.id)!;
    expect(Number(orderA.totalAmount)).toBe(20);
    expect(orderA.status).toBe("DRAFT");
  });
});

describe("changeOrderStatus", () => {
  it("מאפשרת מעבר מותר (DRAFT -> SENT)", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const order = await prisma.order.create({
      data: { projectId: project.id, number: "ORD-TEST-1", totalAmount: 100, status: "DRAFT" },
    });

    const updated = await service.changeOrderStatus(owner.id, project.id, order.id, { status: "SENT" });

    expect(updated.status).toBe("SENT");
  });

  it("דוחה מעבר לא מותר (DRAFT -> DELIVERED ישירות)", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const order = await prisma.order.create({
      data: { projectId: project.id, number: "ORD-TEST-2", totalAmount: 100, status: "DRAFT" },
    });

    await expect(
      service.changeOrderStatus(owner.id, project.id, order.id, { status: "DELIVERED" }),
    ).rejects.toBeInstanceOf(ValidationError);
  });
});

describe("deleteOrder", () => {
  it("מונעת מחיקת הזמנה שאינה טיוטה", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const order = await prisma.order.create({
      data: { projectId: project.id, number: "ORD-TEST-3", totalAmount: 100, status: "SENT" },
    });

    await expect(service.deleteOrder(owner.id, project.id, order.id)).rejects.toBeInstanceOf(ValidationError);
  });

  it("מאפשרת מחיקת טיוטה", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const order = await prisma.order.create({
      data: { projectId: project.id, number: "ORD-TEST-4", totalAmount: 100, status: "DRAFT" },
    });

    await service.deleteOrder(owner.id, project.id, order.id);

    const found = await prisma.order.findUnique({ where: { id: order.id } });
    expect(found).toBeNull();
  });
});
