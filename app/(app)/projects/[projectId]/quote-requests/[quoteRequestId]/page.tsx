import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { getQuoteRequestDetail } from "@/features/quote-requests/service";
import { QuoteRequestDetailView } from "@/features/quote-requests/components/quote-request-detail-view";

export default async function QuoteRequestDetailPage({
  params,
}: {
  params: { projectId: string; quoteRequestId: string };
}) {
  const session = await requireSession();
  const { quoteRequest, professionals, suppliers } = await getQuoteRequestDetail(
    session.userId,
    params.projectId,
    params.quoteRequestId,
  );

  return (
    <div>
      <PageHeader title="פרטי בקשת הצעת מחיר" description="תצוגה מקדימה של הבקשה לפני שליחה, וסטטוס לאחר מכן." />
      <QuoteRequestDetailView
        projectId={params.projectId}
        quoteRequest={quoteRequest}
        professionals={professionals}
        suppliers={suppliers}
      />
    </div>
  );
}
