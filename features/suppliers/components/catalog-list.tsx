import { EmptyState } from "@/components/ui/states";
import { ProductCard } from "./product-card";
import { CreateCatalogProductForm } from "./create-catalog-product-form";
import { listCatalog, listSuppliers } from "../service";

export async function CatalogList({ category, projectId }: { category?: string; projectId?: string }) {
  const products = await listCatalog({ category });

  if (products.length === 0) {
    const suppliers = await listSuppliers({});
    return (
      <EmptyState
        title="הקטלוג ריק"
        description={
          suppliers.length === 0
            ? "אין עדיין ספקים במאגר - יש להוסיף ספק לפני הוספת מוצרים."
            : category
              ? "לא נמצאו מוצרים בקטגוריה הזו - אפשר להסיר את הסינון או להוסיף מוצר חדש."
              : "עדיין אין מוצרים בקטלוג - אפשר להוסיף את המוצר הראשון כאן."
        }
        action={suppliers.length > 0 ? <CreateCatalogProductForm suppliers={suppliers} /> : undefined}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} projectId={projectId} />
      ))}
    </div>
  );
}
