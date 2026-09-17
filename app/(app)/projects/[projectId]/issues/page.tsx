import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { IssuesPageContent } from "@/features/issues/components/issues-page-content";

export default async function ProjectIssuesPage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader title="בעיות ועיכובים" description="כל בעיה או עיכוב שדווח - עד שנפתר ונסגר באישור מפורש." />
      <IssuesPageContent userId={session.userId} projectId={params.projectId} />
    </div>
  );
}
