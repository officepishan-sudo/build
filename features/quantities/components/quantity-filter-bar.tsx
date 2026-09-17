// סרגל סינון קטגוריה/שלב - טופס GET רגיל, בלי JS: מצב הסינון חי ב-URL.
import type { PhaseOption } from "../types";

export function QuantityFilterBar({
  categories,
  phases,
  current,
}: {
  categories: string[];
  phases: PhaseOption[];
  current: { category?: string; phaseId?: string };
}) {
  return (
    <form className="mb-4 flex flex-wrap items-end gap-3 rounded-md border border-gray-200 bg-white p-3">
      <label className="text-sm text-gray-700">
        קטגוריה
        <select name="category" defaultValue={current.category ?? ""} className="mt-1 block rounded-md border border-gray-300 px-3 py-1.5 text-sm">
          <option value="">הכל</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm text-gray-700">
        שלב
        <select name="phaseId" defaultValue={current.phaseId ?? ""} className="mt-1 block rounded-md border border-gray-300 px-3 py-1.5 text-sm">
          <option value="">הכל</option>
          {phases.map((phase) => (
            <option key={phase.id} value={phase.id}>
              {phase.name}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100">
        סינון
      </button>
    </form>
  );
}
