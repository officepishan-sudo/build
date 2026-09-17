import type { ProjectShare, User } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/states";
import { ShareRow } from "./share-row";

type ShareWithUser = ProjectShare & { user: Pick<User, "id" | "name" | "email"> };

export function ShareList({
  projectId,
  owner,
  shares,
  canManage,
}: {
  projectId: string;
  owner: Pick<User, "name" | "email"> | null;
  shares: ShareWithUser[];
  canManage: boolean;
}) {
  return (
    <Card>
      <ul className="divide-y divide-gray-100">
        {owner && (
          <li className="flex items-center justify-between py-3">
            <div>
              <span className="font-medium text-gray-900">{owner.name}</span>
              <span className="ms-2 text-xs text-gray-500">{owner.email}</span>
            </div>
            <Badge tone="info">בעלים - גישה מלאה</Badge>
          </li>
        )}
        {shares.map((share) => (
          <ShareRow key={share.id} projectId={projectId} share={share} canManage={canManage} />
        ))}
      </ul>
      {shares.length === 0 && (
        <div className="pt-2">
          <EmptyState title="עדיין לא שיתפת את הפרויקט עם אף אחד" />
        </div>
      )}
    </Card>
  );
}
