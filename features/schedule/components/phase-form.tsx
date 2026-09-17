"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { createPhaseAction, updatePhaseAction, type ScheduleFormState } from "../actions";
import { PHASE_STATUS_LABEL } from "../constants";
import { toDateInput } from "../date-input";
import type { PhaseWithTasks } from "../types";

const initialState: ScheduleFormState = null;

export function PhaseForm({
  projectId,
  otherPhases,
  phase,
  onDone,
}: {
  projectId: string;
  otherPhases: PhaseWithTasks[];
  phase?: PhaseWithTasks;
  onDone?: () => void;
}) {
  const action = phase ? updatePhaseAction.bind(null, projectId, phase.id) : createPhaseAction.bind(null, projectId);
  const [state, formAction] = useFormState(action, initialState);

  useEffect(() => {
    if (state?.ok) onDone?.();
  }, [state, onDone]);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-3 rounded-md border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2">
      {state?.error && <p className="sm:col-span-2 text-sm text-red-600">{state.error}</p>}
      <Field label="שם השלב">
        <input name="name" defaultValue={phase?.name} required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
      </Field>
      <Field label="סטטוס">
        <select name="status" defaultValue={phase?.status ?? "NOT_STARTED"} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
          {Object.entries(PHASE_STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="תאריך התחלה (לא חובה)">
        <input type="date" name="startDate" defaultValue={toDateInput(phase?.startDate)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
      </Field>
      <Field label="תאריך סיום (לא חובה)">
        <input type="date" name="endDate" defaultValue={toDateInput(phase?.endDate)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
      </Field>
      <Field label="תלות בשלב אחר (לא חובה)">
        <select name="dependsOnPhaseId" defaultValue={phase?.dependsOnPhaseId ?? ""} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
          <option value="">ללא תלות</option>
          {otherPhases.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
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
