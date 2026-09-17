import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { InteriorScreen } from "@/features/interior/components/interior-screen";

export default async function ProjectInteriorPage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader
        title="תכנון פנים ועיצוב"
        description="חדרים, ריהוט, חיפויים ותאורה - סעיף אופציונלי לפי הצורך בפרויקט."
      />
      <InteriorScreen userId={session.userId} projectId={params.projectId} />
    </div>
  );
}
