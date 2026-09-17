import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { listParticipants } from "../service";

const LEVEL_LABEL: Record<string, string> = {
  VIEW: "צפייה",
  COMMENT: "תגובה",
  DECIDE: "השתתפות בהחלטות",
  MANAGE: "ניהול",
  OWNER: "בעלים",
};

export async function ParticipantsList({ userId, projectId }: { userId: string; projectId: string }) {
  const { owner, shares } = await listParticipants(userId, projectId);

  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold text-gray-700">משתתפים בפרויקט</h2>
      <ul className="space-y-2 text-sm">
        {owner && (
          <li className="flex items-center justify-between">
            <span className="text-gray-800">{owner.name}</span>
            <Badge tone="info">בעלים</Badge>
          </li>
        )}
        {shares.map((share) => (
          <li key={share.user.id} className="flex items-center justify-between">
            <span className="text-gray-800">{share.user.name}</span>
            <Badge tone="neutral">{LEVEL_LABEL[share.level]}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
