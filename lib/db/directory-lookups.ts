import { prisma } from "@/lib/prisma";

// קריאות משותפות למאגרי בעלי המקצוע/ספקים - נצרך גם ע"י quote-requests וגם quotes
// כדי לא ליצור ייבוא בין features (professionals/suppliers <-> quote-requests/quotes).

export type ProfessionalLookup = { id: string; name: string; area: string; fields: string[] };
export type SupplierLookup = { id: string; name: string; area: string | null; categories: string[] };

const PROFESSIONAL_SELECT = { id: true, name: true, area: true, fields: true } as const;
const SUPPLIER_SELECT = { id: true, name: true, area: true, categories: true } as const;

export function findProfessionalLookup(id: string): Promise<ProfessionalLookup | null> {
  return prisma.professional.findUnique({ where: { id }, select: PROFESSIONAL_SELECT });
}

export function findSupplierLookup(id: string): Promise<SupplierLookup | null> {
  return prisma.supplier.findUnique({ where: { id }, select: SUPPLIER_SELECT });
}

export function listProfessionalsByIds(ids: string[]): Promise<ProfessionalLookup[]> {
  if (ids.length === 0) return Promise.resolve([]);
  return prisma.professional.findMany({ where: { id: { in: ids } }, select: PROFESSIONAL_SELECT });
}

export function listSuppliersByIds(ids: string[]): Promise<SupplierLookup[]> {
  if (ids.length === 0) return Promise.resolve([]);
  return prisma.supplier.findMany({ where: { id: { in: ids } }, select: SUPPLIER_SELECT });
}

export function listProfessionalOptions(): Promise<ProfessionalLookup[]> {
  return prisma.professional.findMany({ select: PROFESSIONAL_SELECT, orderBy: { name: "asc" } });
}

export function listSupplierOptions(): Promise<SupplierLookup[]> {
  return prisma.supplier.findMany({ select: SUPPLIER_SELECT, orderBy: { name: "asc" } });
}
