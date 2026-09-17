import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { GapDetails } from "./gap-details";
import { selectQuoteAction, rejectQuoteAction } from "../actions";
import { QUOTE_STATUS_LABEL, QUOTE_STATUS_TONE, QUOTE_DECIDED_STATUSES } from "../constants";
import type { Quote } from "@prisma/client";

export function QuoteDetailView({ projectId, quote }: { projectId: string; quote: Quote & { recipientName: string } }) {
  const isDecided = QUOTE_DECIDED_STATUSES.includes(quote.status);

  return (
    <div className="space-y-6">
      <Card className="max-w-2xl">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-semibold text-gray-900">{quote.recipientName}</h2>
          <Badge tone={QUOTE_STATUS_TONE[quote.status]}>{QUOTE_STATUS_LABEL[quote.status]}</Badge>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Field label="מחיר" value={formatCurrency(quote.price.toString())} />
          <div>
            <dt className="text-gray-500">פער מול אומדן</dt>
            <dd className="mt-1">
              <GapDetails price={Number(quote.price)} gapVsEstimate={quote.gapVsEstimate ? Number(quote.gapVsEstimate) : null} />
            </dd>
          </div>
          <Field label="משך ביצוע" value={quote.durationDays ? `${quote.durationDays} ימים` : null} />
          <Field label="תנאי תשלום" value={quote.paymentTerms} />
          <Field label="אחריות" value={quote.warrantyText} />
        </dl>
        <div className="mt-4 space-y-2 text-sm">
          <Field label="כלול / לא כלול בהצעה" value={quote.includesNotes} block />
          <Field label="הערות" value={quote.notes} block />
        </div>
      </Card>

      {isDecided ? (
        <p className="text-sm text-gray-500">ההצעה כבר טופלה ({QUOTE_STATUS_LABEL[quote.status]}) - אין פעולות נוספות.</p>
      ) : (
        <div className="flex gap-3">
          <form action={selectQuoteAction.bind(null, projectId, quote.id)}>
            <Button type="submit">בחירת ההצעה</Button>
          </form>
          <form action={rejectQuoteAction.bind(null, projectId, quote.id)}>
            <Button type="submit" variant="danger">
              דחיית ההצעה
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, block }: { label: string; value: string | null; block?: boolean }) {
  return (
    <div className={block ? "" : undefined}>
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value ?? "לא צויין"}</dd>
    </div>
  );
}
