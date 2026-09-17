import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { SupplierFilterForm } from "@/features/suppliers/components/supplier-filter-form";
import { SupplierList } from "@/features/suppliers/components/supplier-list";
import { CreateSupplierForm } from "@/features/suppliers/components/create-supplier-form";
import { CatalogList } from "@/features/suppliers/components/catalog-list";

export default async function SuppliersPage({
  searchParams,
}: {
  searchParams: { category?: string; projectId?: string };
}) {
  await requireSession();

  return (
    <div className="space-y-10">
      <div>
        <PageHeader title="ספקים" description="איתור ספקים לפי קטגוריה, אזור, תנאים ואחריות." />
        <SupplierFilterForm category={searchParams.category} />
        <SupplierList filter={{ category: searchParams.category }} />
        <details className="mt-8 rounded-lg border border-gray-200 bg-white p-4">
          <summary className="cursor-pointer text-sm font-medium text-brand-700">הוספת ספק חדש</summary>
          <div className="mt-4">
            <CreateSupplierForm />
          </div>
        </details>
      </div>

      <div>
        <PageHeader title="קטלוג מוצרים" description="מוצרים מכל הספקים - מחיר, הובלה, זמינות ואחריות." />
        <CatalogList category={searchParams.category} projectId={searchParams.projectId} />
      </div>
    </div>
  );
}
