import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { GapDetails } from "./gap-details";
import { QUOTE_STATUS_LABEL, QUOTE_STATUS_TONE } from "../constants";
import type { Quote } from "@prisma/client";

// הצעה אחת בלבד בפרויקט - אין טעם בטבלת השוואה (ר' spec P19), מוצג ככרטיס יחיד.
export function QuoteSingleView({ projectId, quote }: { projectId: string; quote: Quote & { recipientName: string } }) {
  return (
    <Card className="max-w-xl">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{quote.recipientName}</h3>
        <Badge tone={QUOTE_STATUS_TONE[quote.status]}>{QUOTE_STATUS_LABEL[quote.status]}</Badge>
      </div>
      <p className="mt-2 text-sm text-gray-600">מחיר: {formatCurrency(quote.price.toString())}</p>
      <div className="mt-2">
        <GapDetails price={Number(quote.price)} gapVsEstimate={quote.gapVsEstimate ? Number(quote.gapVsEstimate) : null} />
      </div>
      <p className="mt-2 text-sm text-gray-500">משך ביצוע: {quote.durationDays ? `${quote.durationDays} ימים` : "לא צויין"}</p>
      <Link href={`/projects/${projectId}/quotes/${quote.id}`} className="mt-3 inline-block">
        <Button variant="secondary">פתח הצעה</Button>
      </Link>
    </Card>
  );
}
