import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { DecisionDetailView } from "@/features/decisions/components/decision-detail-view";

export default async function DecisionDetailPage({
  params,
}: {
  params: { projectId: string; decisionId: string };
}) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader title="פרטי החלטה" />
      <DecisionDetailView userId={session.userId} projectId={params.projectId} decisionId={params.decisionId} />
    </div>
  );
}
