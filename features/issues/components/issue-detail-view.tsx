import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { AppError, NotFoundError } from "@/lib/errors";
import { formatDate } from "@/lib/format";
import { ISSUE_STATUS_LABEL, ISSUE_STATUS_TONE } from "../constants";
import { getIssue } from "../service";
import { IssueStatusActions } from "./issue-status-actions";
import { ResolveIssueForm } from "./resolve-issue-form";

export async function IssueDetailView({ userId, projectId, issueId }: { userId: string; projectId: string; issueId: string }) {
  let issue: Awaited<ReturnType<typeof getIssue>>;
  try {
    issue = await getIssue(userId, projectId, issueId);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return <EmptyState title="הבעיה לא נמצאה" description="ייתכן שהקישור שגוי." />;
    }
    const message = error instanceof AppError ? error.message : undefined;
    return <ErrorState title="לא הצלחנו לטעון את הבעיה" description={message} />;
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Link href={`/projects/${projectId}/issues`} className="text-sm text-brand-600 hover:underline">
        חזרה לרשימת הבעיות
      </Link>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h1 className="text-lg font-semibold text-gray-900">{issue.title}</h1>
          <Badge tone={ISSUE_STATUS_TONE[issue.status]}>{ISSUE_STATUS_LABEL[issue.status]}</Badge>
        </div>
        <p className="mt-2 text-sm text-gray-600">{issue.description}</p>
        <dl className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <Detail label="סוג" value={issue.type ?? "—"} />
          <Detail label="שלב" value={issue.phase?.name ?? "—"} />
          <Detail label="אחראי" value={issue.assignee?.name ?? "—"} />
          <Detail label="יעד" value={formatDate(issue.dueDate)} />
        </dl>
        {issue.impact && <p className="mt-3 whitespace-pre-line text-sm text-gray-500">השפעה / הערות: {issue.impact}</p>}
        {issue._count.photos > 0 && (
          <Link href={`/projects/${projectId}/photos?issueId=${issue.id}`} className="mt-2 inline-block text-sm text-brand-600 hover:underline">
            {issue._count.photos} תמונות מצורפות
          </Link>
        )}
      </Card>
      <Card>
        <h2 className="mb-3 text-sm font-semibold text-gray-700">פעולות</h2>
        <div className="space-y-3">
          <IssueStatusActions projectId={projectId} id={issue.id} status={issue.status} />
          {issue.status !== "CLOSED" && issue.status !== "RESOLVED" && (
            <ResolveIssueForm projectId={projectId} id={issue.id} mode="resolve" />
          )}
          {issue.status === "RESOLVED" && <ResolveIssueForm projectId={projectId} id={issue.id} mode="close" />}
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
