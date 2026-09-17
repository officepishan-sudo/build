import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatDateTime } from "@/lib/format";
import { sendDraftAction, cancelQuoteRequestAction } from "../actions";
import { QUOTE_REQUEST_STATUS_LABEL, QUOTE_REQUEST_STATUS_TONE } from "../constants";
import type { ProfessionalLookup, SupplierLookup } from "@/lib/db/directory-lookups";
import type { QuoteRequest, QuoteRequestRecipient } from "@prisma/client";

type Detail = QuoteRequest & { recipients: QuoteRequestRecipient[]; _count: { quotes: number } };

export function QuoteRequestDetailView({
  projectId,
  quoteRequest,
  professionals,
  suppliers,
}: {
  projectId: string;
  quoteRequest: Detail;
  professionals: ProfessionalLookup[];
  suppliers: SupplierLookup[];
}) {
  const profMap = new Map(professionals.map((p) => [p.id, p.name]));
  const supMap = new Map(suppliers.map((s) => [s.id, s.name]));

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-semibold text-gray-900">{quoteRequest.title}</h2>
          <Badge tone={QUOTE_REQUEST_STATUS_TONE[quoteRequest.status]}>
            {QUOTE_REQUEST_STATUS_LABEL[quoteRequest.status]}
          </Badge>
        </div>
        <p className="mt-3 whitespace-pre-line text-sm text-gray-700">
          {quoteRequest.scopeText || "לא הוזנו עדיין סעיפים/מפרט."}
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-gray-500">דדליין למענה</dt>
            <dd className="font-medium text-gray-900">{quoteRequest.deadline ? formatDate(quoteRequest.deadline) : "לא נקבע"}</dd>
          </div>
          <div>
            <dt className="text-gray-500">נשלחה בתאריך</dt>
            <dd className="font-medium text-gray-900">
              {quoteRequest.sentAt ? formatDateTime(quoteRequest.sentAt) : "טרם נשלחה"}
            </dd>
          </div>
        </dl>
      </Card>

      <Card>
        <h3 className="font-medium text-gray-900">נמענים ({quoteRequest.recipients.length})</h3>
        {quoteRequest.recipients.length === 0 ? (
          <p className="mt-2 text-sm text-amber-700">לא נבחרו נמענים - לא ניתן לשלוח בקשה כזו.</p>
        ) : (
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {quoteRequest.recipients.map((r) => (
              <li key={r.id}>
                {r.professionalId ? profMap.get(r.professionalId) ?? "בעל מקצוע" : supMap.get(r.supplierId ?? "") ?? "ספק"}
              </li>
            ))}
          </ul>
        )}
      </Card>

      {quoteRequest.status === "DRAFT" && (
        <div className="flex gap-3">
          <form action={sendDraftAction.bind(null, projectId, quoteRequest.id)}>
            <Button type="submit">שליחה</Button>
          </form>
          <form action={cancelQuoteRequestAction.bind(null, projectId, quoteRequest.id)}>
            <Button type="submit" variant="danger">
              ביטול
            </Button>
          </form>
        </div>
      )}

      {quoteRequest.status === "SENT" && quoteRequest._count.quotes > 0 && (
        <p className="text-sm text-gray-500">
          התקבלו {quoteRequest._count.quotes} הצעות עד כה - אפשר לצפות בהן במסך הצעות המחיר של הפרויקט.
        </p>
      )}
    </div>
  );
}
