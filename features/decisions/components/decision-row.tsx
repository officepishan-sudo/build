import Link from "next/link";
import type { Decision } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { NeedsCheckBadge } from "@/components/ui/states";
import { formatDate } from "@/lib/format";
import { DECISION_STATUS_LABEL, DECISION_STATUS_TONE } from "../constants";

export function DecisionRow({ projectId, decision }: { projectId: string; decision: Decision }) {
  const isOverdue = decision.status === "OPEN" && decision.deadline && decision.deadline.getTime() < Date.now();

  return (
    <li id={`decision-${decision.id}`} className="scroll-mt-20 py-3">
      <Link
        href={`/projects/${projectId}/decisions/${decision.id}`}
        className="flex flex-col gap-1 rounded-md p-2 -m-2 hover:bg-gray-50"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-medium text-gray-900">{decision.title}</span>
          <div className="flex items-center gap-2">
            {decision.status === "NEEDS_CHECK" && <NeedsCheckBadge />}
            <Badge tone={DECISION_STATUS_TONE[decision.status]}>{DECISION_STATUS_LABEL[decision.status]}</Badge>
          </div>
        </div>
        {decision.description && <p className="text-sm text-gray-500">{decision.description}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          {decision.deadline && (
            <span className={isOverdue ? "font-medium text-red-600" : undefined}>
              דדליין: {formatDate(decision.deadline)}
              {isOverdue && " (עבר המועד)"}
            </span>
          )}
          {decision.dependsOn && <span>תלוי ב: {decision.dependsOn}</span>}
          {decision.sourceType && <span>מקור: {decision.sourceType}</span>}
          {decision.status === "DECIDED" && decision.decidedValue && (
            <span className="text-green-700">הוחלט: {decision.decidedValue}</span>
          )}
        </div>
      </Link>
    </li>
  );
}
