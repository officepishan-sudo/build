import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { PlaySandbox } from "@/features/alternatives/components/play-sandbox";
import { getPlayInitialValues, getSelectionImpact } from "@/features/alternatives/service";

function buildChangeImpactHref(projectId: string, title: string, quoteIds: string[], orderIds: string[]): string {
  const params = new URLSearchParams({ changeDescription: `שינוי משמעותי בחלופה: ${title}` });
  if (quoteIds.length) params.set("affectedQuoteIds", quoteIds.join(","));
  if (orderIds.length) params.set("affectedOrderIds", orderIds.join(","));
  return `/projects/${projectId}/change-impact?${params.toString()}`;
}

export default async function PlayWithResultPage({
  params,
}: {
  params: { projectId: string; alternativeId: string };
}) {
  const session = await requireSession();
  const [initial, impact] = await Promise.all([
    getPlayInitialValues(session.userId, params.projectId, params.alternativeId),
    getSelectionImpact(session.userId, params.projectId, params.alternativeId),
  ]);

  const changeImpactHref = buildChangeImpactHref(
    params.projectId,
    initial.title,
    impact?.quotesNoLongerValid.map((q) => q.id) ?? [],
    impact?.ordersWithCommitments.map((o) => o.id) ?? [],
  );

  return (
    <div>
      <PageHeader title="שחק עם התוצאה" description="ניסוי חופשי - שום דבר לא נשמר עד שלוחצים 'החל'." />
      <PlaySandbox
        projectId={params.projectId}
        alternativeId={params.alternativeId}
        title={initial.title}
        initial={initial}
        changeImpactHref={changeImpactHref}
      />
    </div>
  );
}
