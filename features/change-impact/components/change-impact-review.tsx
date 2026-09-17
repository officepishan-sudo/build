import { Badge } from "@/components/ui/badge";
import { NeedsCheckBadge } from "@/components/ui/states";
import { formatCurrency } from "@/lib/format";
import type { ChangeImpactResult } from "@/lib/change-impact";
import type { ChangeImpactQueryInput } from "../schema";
import { ImpactSection } from "./impact-section";
import { ApproveForm } from "./approve-form";

export function ChangeImpactReview({
  projectId,
  query,
  impact,
  returnTo,
}: {
  projectId: string;
  query: ChangeImpactQueryInput;
  impact: ChangeImpactResult;
  returnTo?: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-700">
          <strong>מה משתנה:</strong> {impact.changeDescription}
        </p>
        <div className="mt-2 flex gap-2">
          <Badge tone={impact.needsReviewCount > 0 ? "warning" : "neutral"}>{impact.needsReviewCount} דורש הכרעה</Badge>
          {impact.hasIrreversibleFacts && <Badge tone="danger">כולל עובדות שכבר קרו בשטח</Badge>}
        </div>
      </div>

      <ImpactSection
        title="דרישות מושפעות"
        emptyText="לא צוינו דרישות מושפעות"
        items={impact.affectedRequirements.map((r) => ({
          key: r.id,
          content: (
            <span>
              {r.label}
              {r.value ? `: ${r.value}` : ""} {r.status === "NEEDS_CHECK" && <NeedsCheckBadge />}
            </span>
          ),
        }))}
      />

      <ImpactSection
        title="סעיפי כמויות מושפעים"
        emptyText="לא צוינו סעיפי כמויות מושפעים"
        items={impact.affectedQuantityItems.map((i) => ({
          key: i.id,
          content: `${i.description} - ${i.quantity} ${i.unit}${i.totalCost ? ` (${formatCurrency(i.totalCost)})` : ""}`,
        }))}
      />

      <ImpactSection
        title="הצעות מחיר שכבר אינן תואמות"
        emptyText="אין הצעות מחיר שנפגעות"
        items={impact.quotesNoLongerValid.map((q) => ({
          key: q.id,
          content: `${q.professionalOrSupplierName} - ${formatCurrency(q.price)} - ${q.reason}`,
        }))}
      />

      <ImpactSection
        title="הזמנות עם התחייבות קיימת"
        emptyText="אין הזמנות מושפעות"
        items={impact.ordersWithCommitments.map((o) => ({
          key: o.id,
          content: (
            <span>
              הזמנה {o.number} ({formatCurrency(o.totalAmount)}) - {o.alreadyHappened ? "כבר בוצעה בפועל" : "טרם סופקה"}
              {o.clarificationNeeded ? ` - ${o.clarificationNeeded}` : ""}
            </span>
          ),
        }))}
      />

      <ImpactSection
        title="תשלומים ששולמו בפועל"
        emptyText="אין תשלומים מושפעים"
        items={impact.paymentsAlreadyMade.map((p) => ({
          key: p.id,
          content: `${p.payeeName} - שולם ${formatCurrency(p.amount)}${p.paidDate ? ` בתאריך ${p.paidDate.slice(0, 10)}` : ""}`,
        }))}
      />

      <ImpactSection
        title="משימות שכבר הושלמו"
        emptyText="אין משימות מושפעות שכבר הושלמו"
        items={impact.tasksAlreadyDone.map((t) => ({ key: t.id, content: `${t.title} - הושלמה, לא מוצגת כאילו לא קרתה` }))}
      />

      <ApproveForm projectId={projectId} query={query} returnTo={returnTo} />
    </div>
  );
}
