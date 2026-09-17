import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { QuotesList } from "@/features/quotes/components/quotes-list";
import { AddQuoteSection } from "@/features/quotes/components/add-quote-section";

export default async function QuotesPage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader
        title="השוואת הצעות מחיר"
        description="השוואה ניטרלית - המערכת לא קובעת \"מנצחת\". הבחירה בהצעה היא תמיד פעולה מפורשת שלכם."
      />
      <QuotesList userId={session.userId} projectId={params.projectId} />
      <details className="mt-8 rounded-lg border border-gray-200 bg-white p-4">
        <summary className="cursor-pointer text-sm font-medium text-brand-700">הוספת הצעה שהתקבלה</summary>
        <div className="mt-4">
          <AddQuoteSection projectId={params.projectId} />
        </div>
      </details>
    </div>
  );
}
