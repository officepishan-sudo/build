import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { AppError, NotFoundError } from "@/lib/errors";
import { formatCurrency, formatDate } from "@/lib/format";
import { isEditable } from "../transitions";
import { CHANGE_STATUS_LABEL, CHANGE_STATUS_TONE } from "../constants";
import { getChangeRequest } from "../service";
import { ChangeStatusActions } from "./change-status-actions";
import { ChangeLinks } from "./change-links";
import { EditChangeForm } from "./edit-change-form";

export async function ChangeDetailView({
  userId,
  projectId,
  changeId,
}: {
  userId: string;
  projectId: string;
  changeId: string;
}) {
  let change: Awaited<ReturnType<typeof getChangeRequest>>;
  try {
    change = await getChangeRequest(userId, projectId, changeId);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return <EmptyState title="השינוי לא נמצא" description="ייתכן שהקישור שגוי." />;
    }
    const message = error instanceof AppError ? error.message : undefined;
    return <ErrorState title="לא הצלחנו לטעון את השינוי" description={message} />;
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Link href={`/projects/${projectId}/changes`} className="text-sm text-brand-600 hover:underline">
        חזרה לרשימת השינויים
      </Link>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h1 className="text-lg font-semibold text-gray-900">{change.title}</h1>
          <Badge tone={CHANGE_STATUS_TONE[change.status]}>{CHANGE_STATUS_LABEL[change.status]}</Badge>
        </div>
        <p className="mt-2 text-sm text-gray-600">{change.reason}</p>
        <dl className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <Detail label="השפעה על המחיר" value={change.priceImpact !== null ? formatCurrency(Number(change.priceImpact)) : "טרם ידוע"} />
          <Detail label="השפעה על לוח הזמנים" value={change.scheduleImpactDays !== null ? `${change.scheduleImpactDays} ימים` : "טרם ידוע"} />
          <Detail label="נוצר בתאריך" value={formatDate(change.createdAt)} />
          <Detail label="הוכרע בתאריך" value={change.decidedAt ? formatDate(change.decidedAt) : "עדיין לא"} />
        </dl>
      </Card>
      <Card>
        <h2 className="mb-3 text-sm font-semibold text-gray-700">פעולות</h2>
        <div className="space-y-3">
          <ChangeLinks projectId={projectId} changeRequestId={change.id} />
          <ChangeStatusActions projectId={projectId} id={change.id} status={change.status} />
        </div>
      </Card>
      {isEditable(change.status) && (
        <EditChangeForm
          projectId={projectId}
          change={{
            id: change.id,
            title: change.title,
            reason: change.reason,
            priceImpact: change.priceImpact !== null ? Number(change.priceImpact) : null,
            scheduleImpactDays: change.scheduleImpactDays,
          }}
        />
      )}
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
