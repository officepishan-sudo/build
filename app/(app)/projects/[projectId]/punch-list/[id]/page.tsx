import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { DefectDetailView } from "@/features/punch-list/components/defect-detail-view";

export default async function DefectDetailPage({ params }: { params: { projectId: string; id: string } }) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader title="פרטי ליקוי" />
      <DefectDetailView userId={session.userId} projectId={params.projectId} defectId={params.id} />
    </div>
  );
}
