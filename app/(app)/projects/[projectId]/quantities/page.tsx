import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { QuantitiesScreen } from "@/features/quantities/components/quantities-screen";

export default async function QuantitiesPage({
  params,
  searchParams,
}: {
  params: { projectId: string };
  searchParams: { category?: string; phaseId?: string };
}) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader title="כתב כמויות" description="ריכוז עבודה וחומרים לפי קטגוריה - עם עלויות ומקור לכל שורה." />
      <QuantitiesScreen userId={session.userId} projectId={params.projectId} searchParams={searchParams} />
    </div>
  );
}
