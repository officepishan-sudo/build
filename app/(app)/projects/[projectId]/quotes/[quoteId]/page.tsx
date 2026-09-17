import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { getQuote } from "@/features/quotes/service";
import { QuoteDetailView } from "@/features/quotes/components/quote-detail-view";

export default async function QuoteDetailPage({ params }: { params: { projectId: string; quoteId: string } }) {
  const session = await requireSession();
  const quote = await getQuote(session.userId, params.projectId, params.quoteId);

  return (
    <div>
      <PageHeader title="פרטי הצעת מחיר" description="פרטי ההצעה המלאים - בחירה או דחייה היא פעולה מפורשת." />
      <QuoteDetailView projectId={params.projectId} quote={quote} />
    </div>
  );
}
