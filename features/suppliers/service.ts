import { NotFoundError } from "@/lib/errors";
import { supplierFilterSchema, supplierFormSchema, productSchema } from "./schema";
import * as repo from "./repository";

// קטלוג וספקים גלובליים (לא תלוי-פרויקט) - requireSession() בלבד ברמת ה-action/page.

export async function listSuppliers(input: unknown) {
  const filter = supplierFilterSchema.parse(input);
  return repo.listSuppliers(filter);
}

export async function getSupplierProfile(id: string) {
  return repo.findSupplierById(id);
}

export async function createSupplier(input: unknown) {
  const data = supplierFormSchema.parse(input);
  return repo.createSupplier(data);
}

export async function updateSupplier(id: string, input: unknown) {
  const data = supplierFormSchema.parse(input);
  return repo.updateSupplier(id, data);
}

export async function listCatalog(input: unknown) {
  const filter = supplierFilterSchema.parse(input);
  return repo.listCatalogProducts(filter);
}

export async function createProduct(supplierId: string, input: unknown) {
  const data = productSchema.parse(input);
  return repo.createProduct(supplierId, data);
}

export async function updateProduct(supplierId: string, productId: string, input: unknown) {
  const data = productSchema.parse(input);
  const existing = await repo.findProductById(productId, supplierId);
  if (!existing) throw new NotFoundError("מוצר");
  return repo.updateProduct(productId, data);
}
