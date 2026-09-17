import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { GapDetails } from "./gap-details";
import { QUOTE_STATUS_LABEL, QUOTE_STATUS_TONE } from "../constants";
import type { Quote } from "@prisma/client";

type QuoteRow = Quote & { recipientName: string };

// יותר מהצעה אחת - טבלת השוואה ניטרלית (בלי "מנצח"). ר' quote-single-view.tsx להצעה בודדת.
export function QuotesTable({ projectId, quotes }: { projectId: string; quotes: QuoteRow[] }) {
  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-right text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <Th>גורם</Th>
            <Th>מחיר</Th>
            <Th>פער מול אומדן</Th>
            <Th>משך ביצוע</Th>
            <Th>תנאי תשלום</Th>
            <Th>אחריות</Th>
            <Th>סטטוס</Th>
            <Th>פעולות</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {quotes.map((quote) => (
            <tr key={quote.id}>
              <td className="py-2">{quote.recipientName}</td>
              <td className="py-2">{formatCurrency(quote.price.toString())}</td>
              <td className="py-2">
                <GapDetails price={Number(quote.price)} gapVsEstimate={quote.gapVsEstimate ? Number(quote.gapVsEstimate) : null} />
              </td>
              <td className="py-2">{quote.durationDays ? `${quote.durationDays} ימים` : "לא צויין"}</td>
              <td className="py-2">{quote.paymentTerms ?? "לא צויין"}</td>
              <td className="py-2">{quote.warrantyText ?? "לא צויינה"}</td>
              <td className="py-2">
                <Badge tone={QUOTE_STATUS_TONE[quote.status]}>{QUOTE_STATUS_LABEL[quote.status]}</Badge>
              </td>
              <td className="py-2">
                <Link href={`/projects/${projectId}/quotes/${quote.id}`}>
                  <Button variant="secondary">פתח הצעה</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="py-2 font-medium">{children}</th>;
}
