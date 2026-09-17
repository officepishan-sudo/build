import { ShareList } from "./share-list";
import { InviteShareForm } from "./invite-share-form";
import { listShares } from "../service";

export async function SharingPageContent({ userId, projectId }: { userId: string; projectId: string }) {
  const { owner, shares, canManage } = await listShares(userId, projectId);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ShareList projectId={projectId} owner={owner} shares={shares} canManage={canManage} />
      </div>
      {canManage && (
        <div>
          <InviteShareForm projectId={projectId} />
        </div>
      )}
    </div>
  );
}
