import type { ProjectShare, User } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { SHARE_LEVEL_DESCRIPTION, SHARE_LEVEL_LABEL } from "../constants";
import { ChangeLevelForm } from "./change-level-form";

type ShareWithUser = ProjectShare & { user: Pick<User, "id" | "name" | "email"> };

export function ShareRow({
  projectId,
  share,
  canManage,
}: {
  projectId: string;
  share: ShareWithUser;
  canManage: boolean;
}) {
  return (
    <li className="space-y-2 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="font-medium text-gray-900">{share.user.name}</span>
          <span className="ms-2 text-xs text-gray-500">{share.user.email}</span>
        </div>
        <Badge tone="neutral">{SHARE_LEVEL_LABEL[share.level]}</Badge>
      </div>
      <p className="text-sm text-gray-600">{SHARE_LEVEL_DESCRIPTION[share.level]}</p>
      {share.domain && <p className="text-xs text-gray-500">תחום ניהול: {share.domain}</p>}
      <p className="text-xs text-gray-400">
        הוזמן: {formatDate(share.invitedAt)}
        {share.acceptedAt && <> · אושר: {formatDate(share.acceptedAt)}</>}
      </p>
      {canManage && <ChangeLevelForm projectId={projectId} share={share} />}
    </li>
  );
}
