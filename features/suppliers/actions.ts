"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type SupplierFormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

export async function createSupplierAction(
  _prev: SupplierFormState,
  formData: FormData,
): Promise<SupplierFormState> {
  await requireSession();
  try {
    await service.createSupplier(supplierFormInput(formData));
  } catch (error) {
    return toFormState(error, "לא הצלחנו להוסיף את הספק, נסו שוב");
  }
  revalidatePath("/suppliers");
  return null;
}

export async function updateSupplierAction(
  supplierId: string,
  _prev: SupplierFormState,
  formData: FormData,
): Promise<SupplierFormState> {
  await requireSession();
  try {
    await service.updateSupplier(supplierId, supplierFormInput(formData));
  } catch (error) {
    return toFormState(error, "לא הצלחנו לעדכן את פרטי הספק, נסו שוב");
  }
  revalidatePath(`/suppliers/${supplierId}`);
  return null;
}

export async function createProductAction(
  supplierId: string,
  _prev: SupplierFormState,
  formData: FormData,
): Promise<SupplierFormState> {
  await requireSession();
  try {
    await service.createProduct(supplierId, productFormInput(formData));
  } catch (error) {
    return toFormState(error, "לא הצלחנו להוסיף את המוצר, נסו שוב");
  }
  revalidatePath(`/suppliers/${supplierId}`);
  return null;
}

export async function updateProductAction(
  supplierId: string,
  productId: string,
  _prev: SupplierFormState,
  formData: FormData,
): Promise<SupplierFormState> {
  await requireSession();
  try {
    await service.updateProduct(supplierId, productId, productFormInput(formData));
  } catch (error) {
    return toFormState(error, "לא הצלחנו לעדכן את המוצר, נסו שוב");
  }
  revalidatePath(`/suppliers/${supplierId}`);
  return null;
}

// שימוש מ-P17 (קטלוג גלובלי): הספק נבחר בטופס עצמו (select), לכן supplierId מגיע מה-formData.
export async function createProductForCatalogAction(
  _prev: SupplierFormState,
  formData: FormData,
): Promise<SupplierFormState> {
  await requireSession();
  const supplierId = String(formData.get("supplierId") || "");
  try {
    await service.createProduct(supplierId, productFormInput(formData));
  } catch (error) {
    return toFormState(error, "לא הצלחנו להוסיף את המוצר, נסו שוב");
  }
  revalidatePath("/suppliers");
  return null;
}

function supplierFormInput(formData: FormData) {
  return {
    name: formData.get("name"),
    categories: formData.getAll("categories"),
    area: formData.get("area") || undefined,
    terms: formData.get("terms") || undefined,
    warrantyPolicy: formData.get("warrantyPolicy") || undefined,
  };
}

function productFormInput(formData: FormData) {
  return {
    name: formData.get("name"),
    category: formData.get("category"),
    priceMin: formData.get("priceMin") || undefined,
    priceMax: formData.get("priceMax") || undefined,
    unit: formData.get("unit"),
    deliveryLeadDays: formData.get("deliveryLeadDays") || undefined,
    availability: formData.get("availability") || undefined,
    warrantyMonths: formData.get("warrantyMonths") || undefined,
  };
}

function toFormState(error: unknown, fallback: string): SupplierFormState {
  if (error instanceof AppError) {
    return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
  }
  console.error("[supplier-action-error]", error);
  return { error: fallback };
}
