import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { AlternativesList } from "@/features/alternatives/components/alternatives-list";

export default async function AlternativesPage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader
        title="חלופות לפרויקט"
        description="כמה כיוונים אפשריים להשוואה - בלי המלצה אוטומטית. אתם בוחרים."
      />
      <AlternativesList userId={session.userId} projectId={params.projectId} />
    </div>
  );
}
