import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/states";
import { formatDate } from "@/lib/format";
import { listQuoteRequests } from "../service";
import { QUOTE_REQUEST_STATUS_LABEL, QUOTE_REQUEST_STATUS_TONE } from "../constants";

export async function QuoteRequestList({ userId, projectId }: { userId: string; projectId: string }) {
  const quoteRequests = await listQuoteRequests(userId, projectId);

  if (quoteRequests.length === 0) {
    return (
      <EmptyState
        title="אין עדיין בקשות הצעת מחיר בפרויקט"
        description="צרו בקשה חדשה כדי לפנות לבעלי מקצוע ולספקים בצורה מסודרת."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {quoteRequests.map((qr) => (
        <Link key={qr.id} href={`/projects/${projectId}/quote-requests/${qr.id}`}>
          <Card className="h-full transition hover:border-brand-400 hover:shadow-md">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-900">{qr.title}</h3>
              <Badge tone={QUOTE_REQUEST_STATUS_TONE[qr.status]}>{QUOTE_REQUEST_STATUS_LABEL[qr.status]}</Badge>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {qr._count.recipients} נמענים · {qr._count.quotes} הצעות התקבלו
            </p>
            <p className="mt-1 text-sm text-gray-500">דדליין: {qr.deadline ? formatDate(qr.deadline) : "לא נקבע"}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
