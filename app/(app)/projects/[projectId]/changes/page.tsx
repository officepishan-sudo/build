import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { ChangesPageContent } from "@/features/changes/components/changes-page-content";

export default async function ProjectChangesPage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader
        title="שינויים ותוספות"
        description="כל שינוי מהתכנון המקורי - מבירור ראשוני ועד אישור וביצוע, בלי לאבד את ההיסטוריה."
      />
      <ChangesPageContent userId={session.userId} projectId={params.projectId} />
    </div>
  );
}
