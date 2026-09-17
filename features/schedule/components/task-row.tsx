"use client";

import { useState } from "react";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteTaskAction } from "../actions";
import { TASK_STATUS_LABEL, TASK_STATUS_TONE } from "../constants";
import { TaskForm } from "./task-form";
import type { ProfessionalOption, TaskLike } from "../types";

export function TaskRow({
  projectId,
  phaseId,
  task,
  professionals,
}: {
  projectId: string;
  phaseId: string;
  task: TaskLike;
  professionals: ProfessionalOption[];
}) {
  const [editing, setEditing] = useState(false);
  const assignee = professionals.find((p) => p.id === task.assigneeProfessionalId);

  if (editing) {
    return <TaskForm projectId={projectId} phaseId={phaseId} professionals={professionals} task={task} onDone={() => setEditing(false)} />;
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 py-2 text-sm last:border-0">
      <div>
        <p className="font-medium text-gray-800">{task.title}</p>
        <p className="text-xs text-gray-500">
          {assignee ? assignee.name : "לא שויך"} · {formatDate(task.startDate)} - {task.endDate ? formatDate(task.endDate) : "לא נקבע"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge tone={TASK_STATUS_TONE[task.status]}>{TASK_STATUS_LABEL[task.status]}</Badge>
        <Button type="button" variant="ghost" onClick={() => setEditing(true)}>
          ערוך
        </Button>
        <form action={deleteTaskAction.bind(null, projectId, task.id)}>
          <Button type="submit" variant="ghost" onClick={confirmDeleteTask}>
            מחיקה
          </Button>
        </form>
      </div>
    </li>
  );
}

function confirmDeleteTask(e: React.MouseEvent<HTMLButtonElement>) {
  if (!window.confirm("למחוק את המשימה?")) {
    e.preventDefault();
  }
}
