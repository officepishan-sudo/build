import Link from "next/link";
import type { ChangeRequest } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { CHANGE_STATUS_LABEL, CHANGE_STATUS_TONE } from "../constants";

export function ChangeRow({ projectId, change }: { projectId: string; change: ChangeRequest }) {
  return (
    <li className="py-3">
      <Link href={`/projects/${projectId}/changes/${change.id}`} className="flex flex-col gap-1 rounded-md p-2 -m-2 hover:bg-gray-50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-medium text-gray-900">{change.title}</span>
          <Badge tone={CHANGE_STATUS_TONE[change.status]}>{CHANGE_STATUS_LABEL[change.status]}</Badge>
        </div>
        <p className="text-sm text-gray-500">{change.reason}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          {change.priceImpact !== null && <span>השפעה על מחיר: {formatCurrency(Number(change.priceImpact))}</span>}
          {change.scheduleImpactDays !== null && <span>השפעה על לו"ז: {change.scheduleImpactDays} ימים</span>}
          {change.decidedAt && <span>הוכרע ב-{formatDate(change.decidedAt)}</span>}
        </div>
      </Link>
    </li>
  );
}
