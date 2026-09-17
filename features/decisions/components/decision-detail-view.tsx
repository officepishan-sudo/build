import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState, ErrorState, NeedsCheckBadge } from "@/components/ui/states";
import { AppError, NotFoundError } from "@/lib/errors";
import { formatDate, formatDateTime } from "@/lib/format";
import { DECISION_STATUS_LABEL, DECISION_STATUS_TONE } from "../constants";
import { getDecision } from "../service";
import { MarkDecidedForm } from "./mark-decided-form";
import { DecisionQuickActions } from "./decision-quick-actions";

export async function DecisionDetailView({
  userId,
  projectId,
  decisionId,
}: {
  userId: string;
  projectId: string;
  decisionId: string;
}) {
  let decision: Awaited<ReturnType<typeof getDecision>>;
  try {
    decision = await getDecision(userId, projectId, decisionId);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return <EmptyState title="ההחלטה לא נמצאה" description="ייתכן שהיא נמחקה, או שהקישור שגוי." />;
    }
    const message = error instanceof AppError ? error.message : undefined;
    return <ErrorState title="לא הצלחנו לטעון את ההחלטה" description={message} />;
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Link href={`/projects/${projectId}/decisions`} className="text-sm text-brand-600 hover:underline">
        חזרה לרשימת ההחלטות
      </Link>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h1 className="text-lg font-semibold text-gray-900">{decision.title}</h1>
          <div className="flex items-center gap-2">
            {decision.status === "NEEDS_CHECK" && <NeedsCheckBadge />}
            <Badge tone={DECISION_STATUS_TONE[decision.status]}>{DECISION_STATUS_LABEL[decision.status]}</Badge>
          </div>
        </div>
        {decision.description && <p className="mt-2 text-sm text-gray-600">{decision.description}</p>}
        <dl className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <Detail label="דדליין" value={formatDate(decision.deadline)} />
          <Detail label="תלוי ב" value={decision.dependsOn ?? "—"} />
          <Detail label="מקור" value={decision.sourceType ?? "—"} />
          <Detail label="נוצרה בתאריך" value={formatDateTime(decision.createdAt)} />
        </dl>
        {decision.status === "DECIDED" && (
          <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            <strong>מה הוחלט:</strong> {decision.decidedValue}
            {decision.decidedAt && <div className="mt-1 text-xs text-green-700">הוחלט ב-{formatDateTime(decision.decidedAt)}</div>}
          </div>
        )}
      </Card>
      <Card>
        <h2 className="mb-3 text-sm font-semibold text-gray-700">פעולות</h2>
        <div className="space-y-4">
          <MarkDecidedForm projectId={projectId} decisionId={decisionId} />
          <DecisionQuickActions projectId={projectId} decisionId={decisionId} status={decision.status} />
        </div>
      </Card>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-gray-400">{label}</dt>
      <dd className="text-gray-800">{value}</dd>
    </div>
  );
}
