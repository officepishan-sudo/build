import Link from "next/link";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PHASE_STATUS_LABEL, PHASE_STATUS_TONE } from "../constants";
import { PhaseActions } from "./phase-actions";
import { TaskList } from "./task-list";
import type { PhaseWithTasks, ProfessionalOption } from "../types";

export function PhaseItem({
  projectId,
  phase,
  allPhases,
  professionals,
  deliveryCount,
  isFirst,
  isLast,
}: {
  projectId: string;
  phase: PhaseWithTasks;
  allPhases: PhaseWithTasks[];
  professionals: ProfessionalOption[];
  deliveryCount?: number;
  isFirst: boolean;
  isLast: boolean;
}) {
  const dependsOn = allPhases.find((p) => p.id === phase.dependsOnPhaseId);
  const otherPhases = allPhases.filter((p) => p.id !== phase.id);

  return (
    <Card>
      <details open={phase.status === "IN_PROGRESS"}>
        <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{phase.name}</span>
            <Badge tone={PHASE_STATUS_TONE[phase.status]}>{PHASE_STATUS_LABEL[phase.status]}</Badge>
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(phase.startDate)} - {phase.endDate ? formatDate(phase.endDate) : "לא נקבע"}
          </span>
        </summary>

        <div className="mt-3 space-y-3 border-t border-gray-100 pt-3">
          {dependsOn && <p className="text-xs text-gray-500">תלוי בשלב: {dependsOn.name}</p>}
          {deliveryCount !== undefined && deliveryCount > 0 && (
            <Link href={`/projects/${projectId}/deliveries`} className="text-xs text-brand-700 hover:underline">
              {deliveryCount} אספקות משויכות לשלב זה
            </Link>
          )}

          <PhaseActions projectId={projectId} phase={phase} otherPhases={otherPhases} isFirst={isFirst} isLast={isLast} />

          <div className="flex flex-wrap gap-3 text-xs">
            <Link href={`/projects/${projectId}/execution`} className="text-brand-700 hover:underline">
              פתיחת שלב בביצוע
            </Link>
            <Link href={`/projects/${projectId}/change-impact`} className="text-brand-700 hover:underline">
              שינוי משמעותי בתאריכים → השפעת שינוי
            </Link>
          </div>

          <TaskList projectId={projectId} phase={phase} professionals={professionals} />
        </div>
      </details>
    </Card>
  );
}
