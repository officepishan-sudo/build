import { requireProjectAccess } from "@/lib/auth/rbac";
import { NotFoundError } from "@/lib/errors";
import { quantityFilterSchema, quantityItemSchema } from "./schema";
import { computeGrandTotal, computeLineTotal } from "./pricing";
import * as repo from "./repository";

export async function listQuantityBoard(userId: string, projectId: string, rawFilters: unknown) {
  await requireProjectAccess(projectId, userId, "VIEW");
  const filters = quantityFilterSchema.parse(rawFilters);

  const [items, categoryRows, phases] = await Promise.all([
    repo.listQuantityItems(projectId, filters),
    repo.listDistinctCategories(projectId),
    repo.listPhasesForProject(projectId),
  ]);

  return {
    items,
    grandTotal: computeGrandTotal(items.map((item) => ({ totalCost: item.totalCost ? Number(item.totalCost) : null }))),
    categories: categoryRows.map((row) => row.category),
    phases,
    filters,
  };
}

export async function createQuantityItem(userId: string, projectId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const data = quantityItemSchema.parse(input);
  const totalCost = computeLineTotal({
    materialCost: data.materialCost,
    laborCost: data.laborCost,
    transportCost: data.transportCost,
    totalCostOverride: data.totalCostOverride,
  });
  return repo.createQuantityItem(projectId, data, totalCost);
}

export async function updateQuantityItem(userId: string, projectId: string, itemId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  await assertItemBelongsToProject(itemId, projectId);
  const data = quantityItemSchema.parse(input);
  const totalCost = computeLineTotal({
    materialCost: data.materialCost,
    laborCost: data.laborCost,
    transportCost: data.transportCost,
    totalCostOverride: data.totalCostOverride,
  });
  return repo.updateQuantityItem(itemId, data, totalCost);
}

export async function deleteQuantityItem(userId: string, projectId: string, itemId: string) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  await assertItemBelongsToProject(itemId, projectId);
  return repo.deleteQuantityItem(itemId);
}

async function assertItemBelongsToProject(itemId: string, projectId: string) {
  const item = await repo.findQuantityItemById(itemId);
  if (!item || item.projectId !== projectId) {
    throw new NotFoundError("שורת כתב הכמויות");
  }
}
