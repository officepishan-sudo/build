import { prisma } from "@/lib/prisma";
import type { MaintenanceItemInput, WarrantyInput } from "./schema";

export function listWarranties(projectId: string) {
  return prisma.warranty.findMany({
    where: { projectId },
    orderBy: { startDate: "desc" },
    include: { supplier: { select: { name: true } }, professional: { select: { name: true } } },
  });
}

export function findWarrantyById(projectId: string, warrantyId: string) {
  return prisma.warranty.findFirst({ where: { id: warrantyId, projectId } });
}

export function createWarranty(projectId: string, data: WarrantyInput) {
  return prisma.warranty.create({ data: { projectId, ...data } });
}

export function updateWarranty(warrantyId: string, data: WarrantyInput) {
  return prisma.warranty.update({ where: { id: warrantyId }, data });
}

export function deleteWarranty(warrantyId: string) {
  return prisma.warranty.delete({ where: { id: warrantyId } });
}

export function listMaintenanceItems(projectId: string) {
  return prisma.maintenanceItem.findMany({
    where: { projectId },
    orderBy: [{ nextDueDate: "asc" }, { createdAt: "desc" }],
    include: { warranty: { select: { itemDescription: true } } },
  });
}

export function findMaintenanceItemById(projectId: string, itemId: string) {
  return prisma.maintenanceItem.findFirst({ where: { id: itemId, projectId } });
}

export function createMaintenanceItem(projectId: string, data: MaintenanceItemInput) {
  return prisma.maintenanceItem.create({ data: { projectId, ...data } });
}

export function updateMaintenanceItem(itemId: string, data: MaintenanceItemInput) {
  return prisma.maintenanceItem.update({ where: { id: itemId }, data });
}

export function deleteMaintenanceItem(itemId: string) {
  return prisma.maintenanceItem.delete({ where: { id: itemId } });
}

// קריאה בלבד: Supplier/Professional שייכים לפיצ'רים אחרים - כאן רק לרשימת בחירה בטופס.
export function listSupplierOptions() {
  return prisma.supplier.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
}

export function listProfessionalOptions() {
  return prisma.professional.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
}
