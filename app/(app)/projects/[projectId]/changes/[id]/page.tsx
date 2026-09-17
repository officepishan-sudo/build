import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { ChangeDetailView } from "@/features/changes/components/change-detail-view";

export default async function ChangeDetailPage({
  params,
}: {
  params: { projectId: string; id: string };
}) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader title="פרטי שינוי" />
      <ChangeDetailView userId={session.userId} projectId={params.projectId} changeId={params.id} />
    </div>
  );
}
