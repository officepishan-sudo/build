import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@prisma/client";

type CatalogProduct = Product & { supplier: { id: string; name: string } };

// projectId, אם קיים, מגיע מ-?projectId= בקטלוג ומאפשר "הוסף לעגלה" - קישור בלבד,
// ללא כתיבת CartItem (ר' דוח ה-handoff לצוות העגלה).
export function ProductCard({ product, projectId }: { product: CatalogProduct; projectId?: string }) {
  const priceLabel =
    product.priceMin || product.priceMax
      ? `${formatCurrency(product.priceMin?.toString())} - ${formatCurrency(product.priceMax?.toString())}`
      : "לא צויין";

  return (
    <Card className="h-full">
      <h3 className="font-semibold text-gray-900">{product.name}</h3>
      <p className="mt-1 text-sm text-gray-500">קטגוריה: {product.category}</p>
      <Link href={`/suppliers/${product.supplier.id}`} className="mt-1 block text-sm text-brand-600 hover:underline">
        ספק: {product.supplier.name}
      </Link>
      <p className="mt-2 text-sm text-gray-600">מחיר: {priceLabel} / {product.unit}</p>
      <p className="mt-1 text-sm text-gray-500">
        הובלה: {product.deliveryLeadDays ? `כ-${product.deliveryLeadDays} ימים` : "לא צויין"}
      </p>
      <p className="mt-1 text-sm text-gray-500">זמינות: {product.availability ?? "לא צויינה"}</p>
      <p className="mt-1 text-sm text-gray-500">
        אחריות: {product.warrantyMonths ? `${product.warrantyMonths} חודשים` : "לא צויינה"}
      </p>
      {projectId ? (
        <Link href={`/projects/${projectId}/cart?addProductId=${product.id}`} className="mt-3 block">
          <Button variant="secondary" className="w-full">
            הוסף לעגלה
          </Button>
        </Link>
      ) : (
        <p className="mt-3 text-xs text-gray-400">כדי להוסיף לעגלה - היכנסו לקטלוג מתוך פרויקט ספציפי.</p>
      )}
    </Card>
  );
}
