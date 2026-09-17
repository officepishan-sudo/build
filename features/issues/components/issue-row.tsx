import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { ISSUE_STATUS_LABEL, ISSUE_STATUS_TONE } from "../constants";

type IssueRowData = {
  id: string;
  title: string;
  description: string;
  status: keyof typeof ISSUE_STATUS_LABEL;
  dueDate: Date | null;
  phase: { name: string } | null;
  assignee: { name: string } | null;
  _count: { photos: number };
};

export function IssueRow({ projectId, issue }: { projectId: string; issue: IssueRowData }) {
  const isOverdue = issue.status === "OPEN" && issue.dueDate && issue.dueDate.getTime() < Date.now();

  return (
    <li className="py-3">
      <Link href={`/projects/${projectId}/issues/${issue.id}`} className="flex flex-col gap-1 rounded-md p-2 -m-2 hover:bg-gray-50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-medium text-gray-900">{issue.title}</span>
          <Badge tone={ISSUE_STATUS_TONE[issue.status]}>{ISSUE_STATUS_LABEL[issue.status]}</Badge>
        </div>
        <p className="text-sm text-gray-500">{issue.description}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          {issue.phase && <span>שלב: {issue.phase.name}</span>}
          {issue.assignee && <span>אחראי: {issue.assignee.name}</span>}
          {issue.dueDate && (
            <span className={isOverdue ? "font-medium text-red-600" : undefined}>
              יעד: {formatDate(issue.dueDate)}
              {isOverdue && " (עבר המועד)"}
            </span>
          )}
          {issue._count.photos > 0 && (
            <Link href={`/projects/${projectId}/photos?issueId=${issue.id}`} className="text-brand-600 hover:underline">
              {issue._count.photos} תמונות
            </Link>
          )}
        </div>
      </Link>
    </li>
  );
}
