import { requireProjectAccess } from "@/lib/auth/rbac";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { addCartItemSchema, splitCartItemSchema, updateCartItemSchema } from "./schema";
import * as repo from "./repository";

export async function listCart(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  return repo.listCartItems(projectId);
}

export async function listPickerOptions(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  const [suppliers, phases] = await Promise.all([repo.listSuppliersBasic(), repo.listPhasesForProject(projectId)]);
  return { suppliers, phases };
}

export async function addManualCartItem(userId: string, projectId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const data = addCartItemSchema.parse(input);
  return repo.createCartItem(projectId, data);
}

/** מטפל ב-handoff מקטלוג הספקים (?addProductId=...&supplierId=...): מוסיף שורת עגלה מהמוצר. */
export async function addProductToCart(userId: string, projectId: string, productId: string, supplierId?: string) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const product = await repo.findProductForHandoff(productId);
  if (!product) {
    throw new NotFoundError("מוצר");
  }
  return repo.createCartItemFromProduct(projectId, product, supplierId ?? null);
}

export async function getCartItemForEdit(userId: string, projectId: string, cartItemId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  const item = await repo.findCartItem(cartItemId);
  if (!item || item.projectId !== projectId) {
    throw new NotFoundError("פריט בעגלה");
  }
  return item;
}

export async function updateCartItem(userId: string, projectId: string, cartItemId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const item = await repo.findCartItem(cartItemId);
  if (!item || item.projectId !== projectId) {
    throw new NotFoundError("פריט בעגלה");
  }
  const data = updateCartItemSchema.parse(input);
  return repo.updateCartItem(cartItemId, data);
}

export async function splitCartItem(userId: string, projectId: string, cartItemId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const item = await repo.findCartItem(cartItemId);
  if (!item || item.projectId !== projectId) {
    throw new NotFoundError("פריט בעגלה");
  }
  const { splitQuantity } = splitCartItemSchema.parse(input);
  if (splitQuantity >= Number(item.quantity)) {
    throw new ValidationError("כמות הפיצול חייבת להיות קטנה מהכמות הכוללת בשורה");
  }
  return repo.splitCartItem(cartItemId, splitQuantity);
}

export async function removeCartItem(userId: string, projectId: string, cartItemId: string) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const item = await repo.findCartItem(cartItemId);
  if (!item || item.projectId !== projectId) {
    throw new NotFoundError("פריט בעגלה");
  }
  return repo.deleteCartItem(cartItemId);
}
