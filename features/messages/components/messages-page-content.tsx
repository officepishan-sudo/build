import { MessageList } from "./message-list";
import { MessageComposer } from "./message-composer";
import { ParticipantsList } from "./participants-list";
import { listAttachableDocuments } from "../service";

export async function MessagesPageContent({ userId, projectId }: { userId: string; projectId: string }) {
  const documents = await listAttachableDocuments(userId, projectId);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <MessageList userId={userId} projectId={projectId} />
        <MessageComposer projectId={projectId} documents={documents} />
      </div>
      <div>
        <ParticipantsList userId={userId} projectId={projectId} />
      </div>
    </div>
  );
}
