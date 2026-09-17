import Link from "next/link";
import { DOCUMENT_CATEGORIES } from "../constants";

export function CategoryFilter({ projectId, active }: { projectId: string; active?: string }) {
  const base = `/projects/${projectId}/documents`;
  return (
    <div className="mb-4 flex flex-wrap gap-2 text-sm">
      <Link
        href={base}
        className={`rounded-full px-3 py-1 ${!active ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
      >
        הכל
      </Link>
      {DOCUMENT_CATEGORIES.map((category) => (
        <Link
          key={category}
          href={`${base}?category=${encodeURIComponent(category)}`}
          className={`rounded-full px-3 py-1 ${active === category ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          {category}
        </Link>
      ))}
    </div>
  );
}
