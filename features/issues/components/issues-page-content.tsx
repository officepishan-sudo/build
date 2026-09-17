import { IssuesList } from "./issues-list";
import { CreateIssueForm } from "./create-issue-form";

export function IssuesPageContent({ userId, projectId }: { userId: string; projectId: string }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <IssuesList userId={userId} projectId={projectId} />
      </div>
      <div>
        <CreateIssueForm projectId={projectId} />
      </div>
    </div>
  );
}
