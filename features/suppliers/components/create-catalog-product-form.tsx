import { ProductForm } from "./product-form";
import { createProductForCatalogAction } from "../actions";
import type { SupplierLookup } from "@/lib/db/directory-lookups";

export function CreateCatalogProductForm({ suppliers }: { suppliers: { id: string; name: string }[] | SupplierLookup[] }) {
  return (
    <div className="mt-4 text-right">
      <ProductForm action={createProductForCatalogAction} submitLabel="הוספת מוצר לקטלוג" supplierOptions={suppliers} />
    </div>
  );
}
