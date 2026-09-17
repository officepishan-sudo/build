import { prisma } from "@/lib/prisma";
import type { AddCartItemInput, UpdateCartItemInput } from "./schema";

export function listCartItems(projectId: string) {
  return prisma.cartItem.findMany({
    where: { projectId },
    include: { supplier: true, product: true },
    orderBy: { createdAt: "asc" },
  });
}

export function findCartItem(id: string) {
  return prisma.cartItem.findUnique({ where: { id }, include: { supplier: true } });
}

export function findProductForHandoff(productId: string) {
  return prisma.product.findUnique({ where: { id: productId } });
}

export function listSuppliersBasic() {
  return prisma.supplier.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
}

export function listPhasesForProject(projectId: string) {
  return prisma.phase.findMany({ where: { projectId }, select: { id: true, name: true }, orderBy: { order: "asc" } });
}

export function createCartItem(projectId: string, data: AddCartItemInput) {
  return prisma.cartItem.create({
    data: {
      projectId,
      description: data.description,
      quantity: data.quantity,
      unitPrice: data.unitPrice,
      supplierId: data.supplierId || null,
      phaseId: data.phaseId || null,
    },
  });
}

export function createCartItemFromProduct(
  projectId: string,
  product: { id: string; name: string; priceMin: unknown; supplierId: string },
  supplierId: string | null,
) {
  return prisma.cartItem.create({
    data: {
      projectId,
      productId: product.id,
      description: product.name,
      quantity: 1,
      unitPrice: product.priceMin ? Number(product.priceMin) : null,
      supplierId: supplierId ?? product.supplierId,
    },
  });
}

export function updateCartItem(id: string, data: UpdateCartItemInput) {
  return prisma.cartItem.update({
    where: { id },
    data: {
      quantity: data.quantity,
      unitPrice: data.unitPrice,
      supplierId: data.supplierId || null,
      phaseId: data.phaseId || null,
    },
  });
}

export async function splitCartItem(id: string, splitQuantity: number) {
  const original = await prisma.cartItem.findUniqueOrThrow({ where: { id } });
  const remaining = Number(original.quantity) - splitQuantity;
  const [updated, created] = await prisma.$transaction([
    prisma.cartItem.update({ where: { id }, data: { quantity: remaining } }),
    prisma.cartItem.create({
      data: {
        projectId: original.projectId,
        productId: original.productId,
        description: original.description,
        quantity: splitQuantity,
        unitPrice: original.unitPrice,
        supplierId: original.supplierId,
        phaseId: original.phaseId,
      },
    }),
  ]);
  return { updated, created };
}

export function deleteCartItem(id: string) {
  return prisma.cartItem.delete({ where: { id } });
}
