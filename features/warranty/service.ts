import { requireProjectAccess } from "@/lib/auth/rbac";
import { NotFoundError } from "@/lib/errors";
import { maintenanceItemSchema, warrantySchema } from "./schema";
import { computeWarrantyStatus } from "./warranty-status";
import * as repo from "./repository";

export async function listWarranties(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  const warranties = await repo.listWarranties(projectId);
  return warranties.map((warranty) => ({ ...warranty, ...computeWarrantyStatus(warranty.startDate, warranty.durationMonths) }));
}

export async function listMaintenanceItems(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  return repo.listMaintenanceItems(projectId);
}

export async function getWarrantyFormOptions(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  const [suppliers, professionals, warranties] = await Promise.all([
    repo.listSupplierOptions(),
    repo.listProfessionalOptions(),
    repo.listWarranties(projectId),
  ]);
  return { suppliers, professionals, warranties: warranties.map((w) => ({ id: w.id, label: w.itemDescription })) };
}

export async function createWarranty(userId: string, projectId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  const data = warrantySchema.parse(input);
  return repo.createWarranty(projectId, data);
}

export async function updateWarranty(userId: string, projectId: string, warrantyId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  const data = warrantySchema.parse(input);
  await findExistingWarranty(projectId, warrantyId);
  return repo.updateWarranty(warrantyId, data);
}

export async function deleteWarranty(userId: string, projectId: string, warrantyId: string) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  await findExistingWarranty(projectId, warrantyId);
  return repo.deleteWarranty(warrantyId);
}

export async function createMaintenanceItem(userId: string, projectId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  const data = maintenanceItemSchema.parse(input);
  return repo.createMaintenanceItem(projectId, data);
}

export async function updateMaintenanceItem(userId: string, projectId: string, itemId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  const data = maintenanceItemSchema.parse(input);
  await findExistingMaintenanceItem(projectId, itemId);
  return repo.updateMaintenanceItem(itemId, data);
}

export async function deleteMaintenanceItem(userId: string, projectId: string, itemId: string) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  await findExistingMaintenanceItem(projectId, itemId);
  return repo.deleteMaintenanceItem(itemId);
}

async function findExistingWarranty(projectId: string, warrantyId: string) {
  const warranty = await repo.findWarrantyById(projectId, warrantyId);
  if (!warranty) throw new NotFoundError("אחריות");
  return warranty;
}

async function findExistingMaintenanceItem(projectId: string, itemId: string) {
  const item = await repo.findMaintenanceItemById(projectId, itemId);
  if (!item) throw new NotFoundError("תזכורת תחזוקה");
  return item;
}
