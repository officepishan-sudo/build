import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SupplierForm } from "./supplier-form";
import { SupplierProductsSection } from "./supplier-products-section";
import { updateSupplierAction } from "../actions";
import { formatDate } from "@/lib/format";
import type { Supplier, Product, Review } from "@prisma/client";

type ProfileData = Supplier & { products: Product[]; reviews: Review[] };

export function SupplierProfileView({ supplier, projectId }: { supplier: ProfileData; projectId?: string }) {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap gap-1">
          {supplier.categories.map((c) => (
            <Badge key={c}>{c}</Badge>
          ))}
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Field label="אזור" value={supplier.area} />
          <Field label="תנאים" value={supplier.terms} />
          <Field label="מדיניות אחריות" value={supplier.warrantyPolicy} />
        </dl>
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium text-brand-700">עריכת פרטי הספק</summary>
          <div className="mt-4">
            <SupplierForm action={updateSupplierAction.bind(null, supplier.id)} defaultValues={supplier} submitLabel="שמירת שינויים" />
          </div>
        </details>
      </Card>

      <SupplierProductsSection supplierId={supplier.id} products={supplier.products} projectId={projectId} />

      <ReviewsSection reviews={supplier.reviews} />

      {!projectId && (
        <Card>
          <p className="text-sm text-gray-600">
            כדי להוסיף מוצרים לעגלה או לבקש הצעת מחיר מהספק - יש להיכנס לקטלוג מתוך פרויקט ספציפי.
          </p>
          <Link href="/" className="mt-3 inline-block">
            <Button>בחרו פרויקט</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value ?? "לא צויין"}</dd>
    </div>
  );
}

function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <Card>
        <p className="text-sm text-gray-500">אין עדיין ביקורות על הספק הזה.</p>
      </Card>
    );
  }
  return (
    <Card>
      <h3 className="font-medium text-gray-900">ביקורות ({reviews.length})</h3>
      <ul className="mt-3 divide-y divide-gray-100">
        {reviews.map((r) => (
          <li key={r.id} className="py-3 text-sm first:pt-0">
            <span className="font-medium text-gray-900">{r.rating} / 5</span>
            {r.comment && <p className="mt-1 text-gray-600">{r.comment}</p>}
            <p className="mt-1 text-xs text-gray-400">{formatDate(r.createdAt)}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
