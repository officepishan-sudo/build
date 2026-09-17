import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { PaymentsPageContent } from "@/features/payments/components/payments-page-content";

export default async function ProjectPaymentsPage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader
        title="תשלומים"
        description="תיעוד בלבד - למי, על מה, כמה ומתי. אין כאן חיוב או סליקה בפועל."
      />
      <PaymentsPageContent userId={session.userId} projectId={params.projectId} />
    </div>
  );
}
