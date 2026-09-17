import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { ProductForm } from "./product-form";
import { ProductRow } from "./product-row";
import { createProductAction } from "../actions";
import type { Product } from "@prisma/client";

// P38: קטלוג מוצרים מלא של הספק, ניתן לעריכה - שונה מ-catalog-list.tsx שהוא הקטלוג
// הגלובלי הצרכני (P17).
export function SupplierProductsSection({
  supplierId,
  products,
  projectId,
}: {
  supplierId: string;
  products: Product[];
  projectId?: string;
}) {
  return (
    <Card>
      <h3 className="font-medium text-gray-900">מוצרים ({products.length})</h3>
      {products.length === 0 ? (
        <div className="mt-3">
          <EmptyState title="אין עדיין מוצרים לספק זה" description="הוסיפו מוצר ראשון למטה." />
        </div>
      ) : (
        <ul className="mt-3 space-y-3">
          {products.map((product) => (
            <ProductRow key={product.id} supplierId={supplierId} product={product} projectId={projectId} />
          ))}
        </ul>
      )}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-brand-700">הוספת מוצר חדש</summary>
        <div className="mt-4">
          <ProductForm action={createProductAction.bind(null, supplierId)} submitLabel="הוספת מוצר" />
        </div>
      </details>
    </Card>
  );
}
