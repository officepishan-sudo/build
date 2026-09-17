import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { AlternativeDetail } from "@/features/alternatives/components/alternative-detail";
import { getAlternative, getSelectionImpact } from "@/features/alternatives/service";

export default async function AlternativeDetailPage({
  params,
}: {
  params: { projectId: string; alternativeId: string };
}) {
  const session = await requireSession();
  const [alternative, impact] = await Promise.all([
    getAlternative(session.userId, params.projectId, params.alternativeId),
    getSelectionImpact(session.userId, params.projectId, params.alternativeId),
  ]);

  return (
    <div>
      <PageHeader title={alternative.title} description="חקירה מלאה של החלופה - שום דבר לא נבחר עבורכם אוטומטית." />
      <AlternativeDetail alternative={alternative} projectId={params.projectId} impact={impact} />
    </div>
  );
}
