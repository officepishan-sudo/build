import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { BudgetLineDetailView } from "@/features/budget/components/budget-line-detail-view";

export default async function BudgetLineDetailPage({
  params,
}: {
  params: { projectId: string; lineId: string };
}) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader title="פרטי קטגוריית תקציב" />
      <BudgetLineDetailView userId={session.userId} projectId={params.projectId} lineId={params.lineId} />
    </div>
  );
}
