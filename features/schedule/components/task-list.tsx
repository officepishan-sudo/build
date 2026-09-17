import { TaskRow } from "./task-row";
import { AddTask } from "./add-task";
import type { PhaseWithTasks, ProfessionalOption } from "../types";

export function TaskList({
  projectId,
  phase,
  professionals,
}: {
  projectId: string;
  phase: PhaseWithTasks;
  professionals: ProfessionalOption[];
}) {
  return (
    <div className="mt-3 space-y-2">
      {phase.tasks.length === 0 ? (
        <p className="text-sm text-gray-400">אין עדיין משימות בשלב הזה.</p>
      ) : (
        <ul>
          {phase.tasks.map((task) => (
            <TaskRow key={task.id} projectId={projectId} phaseId={phase.id} task={task} professionals={professionals} />
          ))}
        </ul>
      )}
      <AddTask projectId={projectId} phaseId={phase.id} professionals={professionals} />
    </div>
  );
}
