import { Button } from "@/components/ui/button";
import { updateTaskStatusAction } from "../actions";
import { TASK_STATUS_LABEL } from "../constants";
import type { TaskStatus } from "@prisma/client";

export function TaskStatusForm({ projectId, taskId, current }: { projectId: string; taskId: string; current: TaskStatus }) {
  return (
    <form action={updateTaskStatusAction.bind(null, projectId, taskId)} className="flex items-center gap-2">
      <select name="status" defaultValue={current} className="rounded-md border border-gray-300 px-2 py-1 text-xs">
        {Object.entries(TASK_STATUS_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <Button type="submit" variant="secondary" className="px-2 py-1 text-xs">
        עדכן
      </Button>
    </form>
  );
}
