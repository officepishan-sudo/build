"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { createQuantityItemAction, updateQuantityItemAction, type QuantityFormState } from "../actions";
import type { PhaseOption, QuantityRowData } from "../types";

const initialState: QuantityFormState = null;

export function QuantityItemForm({
  projectId,
  phases,
  categories,
  item,
  onDone,
}: {
  projectId: string;
  phases: PhaseOption[];
  categories: string[];
  item?: QuantityRowData;
  onDone?: () => void;
}) {
  const action = item
    ? updateQuantityItemAction.bind(null, projectId, item.id)
    : createQuantityItemAction.bind(null, projectId);
  const [state, formAction] = useFormState(action, initialState);

  useEffect(() => {
    if (state?.ok) onDone?.();
  }, [state, onDone]);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-3 rounded-md border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2">
      {state?.error && <p className="sm:col-span-2 text-sm text-red-600">{state.error}</p>}
      <TextField name="category" label="קטגוריה" defaultValue={item?.category} list="quantity-categories" required />
      <datalist id="quantity-categories">
        {categories.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      <TextField name="description" label="תיאור" defaultValue={item?.description} required />
      <TextField name="quantity" label="כמות" type="number" step="0.001" defaultValue={numOrEmpty(item?.quantity)} required />
      <TextField name="unit" label="יחידה" defaultValue={item?.unit} required />
      <TextField name="materialCost" label="עלות חומר" type="number" step="0.01" defaultValue={numOrEmpty(item?.materialCost)} />
      <TextField name="laborCost" label="עלות עבודה" type="number" step="0.01" defaultValue={numOrEmpty(item?.laborCost)} />
      <TextField name="transportCost" label="עלות הובלה" type="number" step="0.01" defaultValue={numOrEmpty(item?.transportCost)} />
      <TextField name="totalCostOverride" label="סה״כ ידני (דורס חישוב)" type="number" step="0.01" />
      <PhaseSelect phases={phases} defaultValue={item?.phaseId ?? ""} />
      <TextField name="source" label="מקור הנתון" defaultValue={item?.source ?? ""} />
      <label className="flex items-center gap-2 self-end text-sm text-gray-700">
        <input type="checkbox" name="needsCheck" defaultChecked={item?.needsCheck} className="h-4 w-4" />
        דורש בדיקה
      </label>
      <FormActions onCancel={onDone} />
    </form>
  );
}

function PhaseSelect({ phases, defaultValue }: { phases: PhaseOption[]; defaultValue: string }) {
  return (
    <label className="text-sm text-gray-700">
      שלב (לא חובה)
      <select name="phaseId" defaultValue={defaultValue} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
        <option value="">ללא שיוך לשלב</option>
        {phases.map((phase) => (
          <option key={phase.id} value={phase.id}>
            {phase.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextField({
  name,
  label,
  type = "text",
  ...rest
}: { name: string; label: string; type?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="text-sm text-gray-700">
      {label}
      <input
        name={name}
        type={type}
        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        {...rest}
      />
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

function numOrEmpty(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}
