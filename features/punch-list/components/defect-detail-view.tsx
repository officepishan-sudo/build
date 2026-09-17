import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { AppError, NotFoundError } from "@/lib/errors";
import { formatDate } from "@/lib/format";
import { DEFECT_STATUS_LABEL, DEFECT_STATUS_TONE } from "../constants";
import { getDefect } from "../service";
import { DefectStatusActions } from "./defect-status-actions";
import { DefectNoteForm } from "./defect-note-form";

export async function DefectDetailView({ userId, projectId, defectId }: { userId: string; projectId: string; defectId: string }) {
  let defect: Awaited<ReturnType<typeof getDefect>>;
  try {
    defect = await getDefect(userId, projectId, defectId);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return <EmptyState title="הליקוי לא נמצא" description="ייתכן שהקישור שגוי." />;
    }
    const message = error instanceof AppError ? error.message : undefined;
    return <ErrorState title="לא הצלחנו לטעון את הליקוי" description={message} />;
  }

  const needsResolve = defect.status !== "RESOLVED" && defect.status !== "IN_REVIEW" && defect.status !== "CLOSED";
  const needsClose = defect.status === "RESOLVED" || defect.status === "IN_REVIEW";

  return (
    <div className="max-w-2xl space-y-4">
      <Link href={`/projects/${projectId}/punch-list`} className="text-sm text-brand-600 hover:underline">
        חזרה לרשימת הליקויים
      </Link>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h1 className="text-lg font-semibold text-gray-900">{defect.title}</h1>
          <Badge tone={DEFECT_STATUS_TONE[defect.status]}>{DEFECT_STATUS_LABEL[defect.status]}</Badge>
        </div>
        <p className="mt-2 text-sm text-gray-600">{defect.description}</p>
        <dl className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <Detail label="אחראי" value={defect.assignee?.name ?? "—"} />
          <Detail label="יעד" value={formatDate(defect.dueDate)} />
        </dl>
        {defect.resolutionNotes && (
          <p className="mt-3 whitespace-pre-line text-sm text-gray-500">הערות: {defect.resolutionNotes}</p>
        )}
        {defect._count.photos > 0 && (
          <Link href={`/projects/${projectId}/photos?defectId=${defect.id}`} className="mt-2 inline-block text-sm text-brand-600 hover:underline">
            {defect._count.photos} תמונות מצורפות
          </Link>
        )}
      </Card>
      <Card>
        <h2 className="mb-3 text-sm font-semibold text-gray-700">פעולות</h2>
        <div className="space-y-3">
          <DefectStatusActions projectId={projectId} id={defect.id} status={defect.status} />
          {needsResolve && <DefectNoteForm projectId={projectId} id={defect.id} mode="resolve" />}
          {needsClose && <DefectNoteForm projectId={projectId} id={defect.id} mode="close" />}
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
