import { EmptyState } from "@/components/ui/states";
import { SupplierCard } from "./supplier-card";
import { listSuppliers } from "../service";
import type { SupplierFilterInput } from "../schema";

export async function SupplierList({ filter }: { filter: SupplierFilterInput }) {
  const suppliers = await listSuppliers(filter);

  if (suppliers.length === 0) {
    return (
      <EmptyState
        title="לא נמצאו ספקים"
        description={
          filter.category
            ? "נסו להסיר את הסינון לפי קטגוריה."
            : "עדיין אין ספקים במאגר - אפשר להוסיף את הראשון למטה."
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {suppliers.map((supplier) => (
        <SupplierCard key={supplier.id} supplier={supplier} />
      ))}
    </div>
  );
}
