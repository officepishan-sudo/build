import { prisma } from "@/lib/prisma";
import type { SupplierFormInput, ProductInput } from "./schema";

export function listSuppliers(filter: { category?: string }) {
  return prisma.supplier.findMany({
    where: { categories: filter.category ? { has: filter.category } : undefined },
    orderBy: { name: "asc" },
  });
}

export function findSupplierById(id: string) {
  return prisma.supplier.findUnique({
    where: { id },
    include: {
      products: { orderBy: { name: "asc" } },
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });
}

export function createSupplier(data: SupplierFormInput) {
  return prisma.supplier.create({ data });
}

export function updateSupplier(id: string, data: SupplierFormInput) {
  return prisma.supplier.update({ where: { id }, data });
}

export function listCatalogProducts(filter: { category?: string }) {
  return prisma.product.findMany({
    where: { category: filter.category || undefined },
    include: { supplier: { select: { id: true, name: true } } },
    orderBy: { name: "asc" },
  });
}

export function createProduct(supplierId: string, data: ProductInput) {
  return prisma.product.create({ data: { ...data, supplierId } });
}

export function findProductById(id: string, supplierId: string) {
  return prisma.product.findFirst({ where: { id, supplierId } });
}

export function updateProduct(id: string, data: ProductInput) {
  return prisma.product.update({ where: { id }, data });
}
