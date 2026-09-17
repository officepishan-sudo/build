import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductForm } from "./product-form";
import { updateProductAction } from "../actions";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@prisma/client";

export function ProductRow({
  supplierId,
  product,
  projectId,
}: {
  supplierId: string;
  product: Product;
  projectId?: string;
}) {
  return (
    <li className="rounded-md border border-gray-200 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-medium text-gray-900">{product.name}</p>
          <p className="text-sm text-gray-500">
            {product.category} · {formatCurrency(product.priceMin?.toString())}-{formatCurrency(product.priceMax?.toString())} /{" "}
            {product.unit}
          </p>
        </div>
        {projectId && (
          <Link href={`/projects/${projectId}/cart?addProductId=${product.id}`}>
            <Button variant="secondary">הוסף לעגלה</Button>
          </Link>
        )}
      </div>
      <details className="mt-2">
        <summary className="cursor-pointer text-xs font-medium text-brand-700">עריכת מוצר</summary>
        <div className="mt-3">
          <ProductForm
            action={updateProductAction.bind(null, supplierId, product.id)}
            defaultValues={product}
            submitLabel="שמירת שינויים"
          />
        </div>
      </details>
    </li>
  );
}
