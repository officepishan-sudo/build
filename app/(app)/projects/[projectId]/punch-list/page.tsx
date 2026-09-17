import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { PunchListPageContent } from "@/features/punch-list/components/punch-list-page-content";

export default async function ProjectPunchListPage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader title="ליקויים (Punch List)" description="ליקויים לפני סיום - נפתר ונסגר הם שני שלבים נפרדים, לא אותה פעולה." />
      <PunchListPageContent userId={session.userId} projectId={params.projectId} />
    </div>
  );
}
