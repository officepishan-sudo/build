import { EmptyState } from "@/components/ui/states";
import { QuotesTable } from "./quotes-table";
import { QuoteSingleView } from "./quote-single-view";
import { listQuotes } from "../service";

export async function QuotesList({ userId, projectId }: { userId: string; projectId: string }) {
  const quotes = await listQuotes(userId, projectId);

  if (quotes.length === 0) {
    return (
      <EmptyState
        title="עדיין לא נוספו הצעות מחיר לפרויקט"
        description="כשמקבלים הצעה בטלפון, במייל או פנים אל פנים - מוסיפים אותה כאן ידנית כדי להשוות בצורה מסודרת."
      />
    );
  }

  const [firstQuote] = quotes;
  if (quotes.length === 1 && firstQuote) {
    return <QuoteSingleView projectId={projectId} quote={firstQuote} />;
  }

  return <QuotesTable projectId={projectId} quotes={quotes} />;
}
