import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { ForbiddenError, ValidationError } from "@/lib/errors";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";
import * as service from "./service";

async function createSupplier(name = "ספק בדיקה") {
  return prisma.supplier.create({ data: { name, categories: [] } });
}

describe("addManualCartItem", () => {
  it("מוסיפה פריט ידני לעגלה", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);

    const item = await service.addManualCartItem(owner.id, project.id, {
      description: "צינור PVC",
      quantity: "10",
      unitPrice: "5.5",
    });

    expect(item.description).toBe("צינור PVC");
    expect(Number(item.quantity)).toBe(10);
  });

  it("דוחה משתמש בלי גישה לפרויקט", async () => {
    const owner = await createTestUser();
    const stranger = await createTestUser();
    const project = await createTestProject(owner.id);

    await expect(
      service.addManualCartItem(stranger.id, project.id, { description: "משהו", quantity: "1" }),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe("splitCartItem", () => {
  it("מפצלת שורה לשתיים ומחלקת את הכמות", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const item = await prisma.cartItem.create({
      data: { projectId: project.id, description: "לוחות עץ", quantity: 10, unitPrice: 20 },
    });

    const { updated, created } = await service.splitCartItem(owner.id, project.id, item.id, { splitQuantity: "4" });

    expect(Number(updated.quantity)).toBe(6);
    expect(Number(created.quantity)).toBe(4);
    expect(created.description).toBe("לוחות עץ");
  });

  it("דוחה פיצול בכמות גדולה או שווה לכמות הכוללת", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const item = await prisma.cartItem.create({
      data: { projectId: project.id, description: "לוחות עץ", quantity: 5 },
    });

    await expect(service.splitCartItem(owner.id, project.id, item.id, { splitQuantity: "5" })).rejects.toBeInstanceOf(
      ValidationError,
    );
  });
});

describe("addProductToCart (handoff מקטלוג ספקים)", () => {
  it("יוצרת שורת עגלה מתוך מוצר עם כמות 1 כברירת מחדל", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    const supplier = await createSupplier();
    const product = await prisma.product.create({
      data: { supplierId: supplier.id, name: "מלט", category: "בנייה", unit: "שק", priceMin: 30 },
    });

    const item = await service.addProductToCart(owner.id, project.id, product.id, supplier.id);

    expect(item.description).toBe("מלט");
    expect(Number(item.quantity)).toBe(1);
    expect(item.supplierId).toBe(supplier.id);
    expect(item.productId).toBe(product.id);
  });
});
