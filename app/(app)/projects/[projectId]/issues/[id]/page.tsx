import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { IssueDetailView } from "@/features/issues/components/issue-detail-view";

export default async function IssueDetailPage({ params }: { params: { projectId: string; id: string } }) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader title="פרטי בעיה" />
      <IssueDetailView userId={session.userId} projectId={params.projectId} issueId={params.id} />
    </div>
  );
}
