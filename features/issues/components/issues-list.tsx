import { Card } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { AppError } from "@/lib/errors";
import { listIssues } from "../service";
import { IssueRow } from "./issue-row";

export async function IssuesList({ userId, projectId }: { userId: string; projectId: string }) {
  let issues: Awaited<ReturnType<typeof listIssues>>;
  try {
    issues = await listIssues(userId, projectId);
  } catch (error) {
    const message = error instanceof AppError ? error.message : undefined;
    return <ErrorState title="לא הצלחנו לטעון את הבעיות" description={message} />;
  }

  if (issues.length === 0) {
    return <EmptyState title="הכל תקין - אין בעיות פתוחות" description="ברגע שתדווחו על בעיה או עיכוב, היא תופיע כאן." />;
  }

  return (
    <Card>
      <ul className="divide-y divide-gray-100">
        {issues.map((issue) => (
          <IssueRow key={issue.id} projectId={projectId} issue={issue} />
        ))}
      </ul>
    </Card>
  );
}
