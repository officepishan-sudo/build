"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { createTaskAction, updateTaskAction, type ScheduleFormState } from "../actions";
import { TASK_STATUS_LABEL } from "../constants";
import type { ProfessionalOption, TaskLike } from "../types";

const initialState: ScheduleFormState = null;

export function TaskForm({
  projectId,
  phaseId,
  professionals,
  task,
  onDone,
}: {
  projectId: string;
  phaseId: string;
  professionals: ProfessionalOption[];
  task?: TaskLike;
  onDone?: () => void;
}) {
  const action = task ? updateTaskAction.bind(null, projectId, task.id) : createTaskAction.bind(null, projectId, phaseId);
  const [state, formAction] = useFormState(action, initialState);

  useEffect(() => {
    if (state?.ok) onDone?.();
  }, [state, onDone]);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-3 rounded-md border border-gray-200 bg-white p-3 sm:grid-cols-2">
      {state?.error && <p className="sm:col-span-2 text-sm text-red-600">{state.error}</p>}
      <Field label="כותרת המשימה">
        <input name="title" defaultValue={task?.title} required className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm" />
      </Field>
      <Field label="אחראי (לא חובה)">
        <select name="assigneeProfessionalId" defaultValue={task?.assigneeProfessionalId ?? ""} className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm">
          <option value="">לא שויך</option>
          {professionals.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="סטטוס">
        <select name="status" defaultValue={task?.status ?? "NOT_STARTED"} className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm">
          {Object.entries(TASK_STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="תאריך התחלה (לא חובה)">
        <input type="date" name="startDate" defaultValue={toDateInput(task?.startDate)} className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm" />
      </Field>
      <Field label="תאריך סיום (לא חובה)">
        <input type="date" name="endDate" defaultValue={toDateInput(task?.endDate)} className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm" />
      </Field>
      <Field label="הערות (לא חובה)">
        <input name="notes" defaultValue={task?.notes ?? ""} className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm" />
      </Field>
      <FormActions onCancel={onDone} />
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="text-sm text-gray-700">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function FormActions({ onCancel }: { onCancel?: () => void }) {
  const { pending } = useFormStatus();
  return (
    <div className="flex items-center gap-2 sm:col-span-2">
      <Button type="submit" disabled={pending}>
        {pending ? "שומר..." : "שמירה"}
      </Button>
      {onCancel && (
        <Button type="button" variant="secondary" onClick={onCancel}>
          ביטול
        </Button>
      )}
    </div>
  );
}

function toDateInput(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}
