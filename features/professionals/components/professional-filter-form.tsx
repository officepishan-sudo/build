import { PROFESSIONAL_FIELD_OPTIONS } from "../constants";

// טופס סינון בלי JS - GET רגיל שמעדכן את ה-URL, תואם לעיקרון "state בכתובת".
export function ProfessionalFilterForm({ field, area }: { field?: string; area?: string }) {
  return (
    <form method="get" className="mb-6 flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="field" className="mb-1 block text-sm font-medium text-gray-700">
          תחום
        </label>
        <select
          id="field"
          name="field"
          defaultValue={field ?? ""}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">הכל</option>
          {PROFESSIONAL_FIELD_OPTIONS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="area" className="mb-1 block text-sm font-medium text-gray-700">
          אזור
        </label>
        <input
          id="area"
          name="area"
          defaultValue={area ?? ""}
          placeholder="למשל: מרכז"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <button type="submit" className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
        סינון
      </button>
      <a href="/professionals" className="text-sm text-gray-500 hover:underline">
        איפוס סינון
      </a>
    </form>
  );
}
