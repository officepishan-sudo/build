import { EVENT_TYPE_LABEL, type CalendarEventType } from "../_lib/calendar-types";

const TYPE_OPTIONS: CalendarEventType[] = ["task", "delivery", "payment", "decision"];

// סינון לפי סוג - טופס GET, מצב חי ב-URL (?type=...), בלי JS בצד הלקוח.
export function CalendarFilterBar({ current }: { current?: string }) {
  return (
    <form className="mb-4 flex flex-wrap items-end gap-3 rounded-md border border-gray-200 bg-white p-3">
      <label className="text-sm text-gray-700">
        סוג אירוע
        <select name="type" defaultValue={current ?? ""} className="mt-1 block rounded-md border border-gray-300 px-3 py-1.5 text-sm">
          <option value="">הכל</option>
          {TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>
              {EVENT_TYPE_LABEL[type]}
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
