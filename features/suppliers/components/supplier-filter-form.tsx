import { SUPPLIER_CATEGORY_SUGGESTIONS } from "../constants";

export function SupplierFilterForm({ category }: { category?: string }) {
  return (
    <form method="get" className="mb-6 flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">
          קטגוריה
        </label>
        <select
          id="category"
          name="category"
          defaultValue={category ?? ""}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">הכל</option>
          {SUPPLIER_CATEGORY_SUGGESTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
        סינון
      </button>
      <a href="/suppliers" className="text-sm text-gray-500 hover:underline">
        איפוס סינון
      </a>
    </form>
  );
}
