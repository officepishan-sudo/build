import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PROJECT_STATUS_LABEL, PROJECT_STATUS_TONE, PROJECT_TYPE_LABEL } from "../constants";
import type { Project } from "@prisma/client";

export function ProjectCard({ project }: { project: Project & { budgetLines: { plannedAmount: unknown }[] } }) {
  const plannedTotal = project.budgetLines.reduce((sum, line) => sum + Number(line.plannedAmount), 0);

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="h-full transition hover:border-brand-400 hover:shadow-md">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900">{project.name}</h3>
          <Badge tone={PROJECT_STATUS_TONE[project.status]}>{PROJECT_STATUS_LABEL[project.status]}</Badge>
        </div>
        <p className="mt-1 text-sm text-gray-500">{PROJECT_TYPE_LABEL[project.type]}</p>
        {plannedTotal > 0 && (
          <p className="mt-3 text-sm text-gray-600">
            תקציב מתוכנן: <span className="font-medium">{plannedTotal.toLocaleString("he-IL")} ₪</span>
          </p>
        )}
        {project.status === "PAUSED" && project.pausedReason && (
          <p className="mt-2 text-xs text-amber-700">מושהה: {project.pausedReason}</p>
        )}
      </Card>
    </Link>
  );
}
