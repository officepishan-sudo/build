import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { QuoteRequestList } from "@/features/quote-requests/components/quote-request-list";

export default async function QuoteRequestsPage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader
        title="בקשות הצעת מחיר"
        description="פנייה מסודרת לבעלי מקצוע ולספקים - סעיפים, כמויות, מפרט ודדליין."
        actions={
          <Link href={`/projects/${params.projectId}/quote-requests/new`}>
            <Button>בקשה חדשה</Button>
          </Link>
        }
      />
      <QuoteRequestList userId={session.userId} projectId={params.projectId} />
    </div>
  );
}
