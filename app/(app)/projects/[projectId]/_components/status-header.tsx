import { Badge } from "@/components/ui/badge";
import { PROJECT_STATUS_LABEL, PROJECT_STATUS_TONE, PROJECT_TYPE_LABEL } from "@/features/projects/constants";
import type { ProjectHeaderData } from "../_lib/dashboard-types";
import { PauseResumePanel } from "./pause-resume-panel";

export function StatusHeader({ header }: { header: ProjectHeaderData }) {
  const isPaused = header.status === "PAUSED";

  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-gray-200 pb-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-gray-900">{header.name}</h1>
          <Badge tone={PROJECT_STATUS_TONE[header.status]}>{PROJECT_STATUS_LABEL[header.status]}</Badge>
        </div>
        <p className="mt-1 text-sm text-gray-500">{PROJECT_TYPE_LABEL[header.type]}</p>
        {isPaused && header.pausedReason && (
          <p className="mt-1 text-xs text-amber-700">מושהה: {header.pausedReason}</p>
        )}
      </div>
      <PauseResumePanel projectId={header.id} isPaused={isPaused} />
    </div>
  );
}
