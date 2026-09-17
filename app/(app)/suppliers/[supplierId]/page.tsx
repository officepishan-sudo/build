import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { getSupplierProfile } from "@/features/suppliers/service";
import { SupplierProfileView } from "@/features/suppliers/components/supplier-profile-view";

export default async function SupplierProfilePage({
  params,
  searchParams,
}: {
  params: { supplierId: string };
  searchParams: { projectId?: string };
}) {
  await requireSession();
  const supplier = await getSupplierProfile(params.supplierId);

  if (!supplier) {
    return <p className="text-gray-500">הספק לא נמצא.</p>;
  }

  return (
    <div>
      <PageHeader title={supplier.name} description="פרופיל ספק וקטלוג מוצרים מלא." />
      <SupplierProfileView supplier={supplier} projectId={searchParams.projectId} />
    </div>
  );
}
