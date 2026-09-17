import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { PHASE_STATUS_LABEL, PHASE_STATUS_TONE, TASK_STATUS_LABEL, TASK_STATUS_TONE } from "../constants";
import { TaskStatusForm } from "./task-status-form";
import type { Phase, Task, Professional } from "@prisma/client";

type PhaseWithTasks = Phase & { tasks: (Task & { assignee: Professional | null })[]; _count: { photos: number } };

export function PhaseExecutionCard({ projectId, phase }: { projectId: string; phase: PhaseWithTasks }) {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <h3 className="font-medium text-gray-900">{phase.name}</h3>
        <Badge tone={PHASE_STATUS_TONE[phase.status]}>{PHASE_STATUS_LABEL[phase.status]}</Badge>
      </div>

      {phase.tasks.length === 0 ? (
        <p className="py-4 text-sm text-gray-500">
          לשלב הזה עדיין אין משימות.{" "}
          <Link href={`/projects/${projectId}/schedule`} className="text-brand-600 hover:underline">
            ליצירת משימה בלוח הזמנים
          </Link>
        </p>
      ) : (
        <table className="w-full text-right text-sm">
          <tbody className="divide-y divide-gray-100">
            {phase.tasks.map((task) => (
              <tr key={task.id}>
                <td className="py-2 pl-2 text-gray-900">{task.title}</td>
                <td className="py-2 pl-2 text-gray-500">{task.assignee?.name ?? "לא שויך אחראי"}</td>
                <td className="py-2 pl-2 text-gray-500">{formatDate(task.endDate)}</td>
                <td className="py-2 pl-2">
                  <Badge tone={TASK_STATUS_TONE[task.status]}>{TASK_STATUS_LABEL[task.status]}</Badge>
                </td>
                <td className="py-2">
                  <TaskStatusForm projectId={projectId} taskId={task.id} current={task.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-3 flex flex-wrap gap-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
        <Link href={`/projects/${projectId}/photos`} className="hover:underline">
          תמונות בשלב: {phase._count.photos}
        </Link>
        <Link href={`/projects/${projectId}/issues`} className="hover:underline">
          דיווח על בעיה בשלב
        </Link>
      </div>
    </Card>
  );
}
