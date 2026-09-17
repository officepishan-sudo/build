import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { RegulatoryScreen } from "@/features/regulatory/components/regulatory-screen";

export default async function ProjectRegulatoryPage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader
        title="רשימת בדיקה רגולטורית"
        description="בדיקות עזר לפי סוג הפרויקט - אינה תחליף לייעוץ משפטי או הנדסי."
      />
      <RegulatoryScreen userId={session.userId} projectId={params.projectId} />
    </div>
  );
}
