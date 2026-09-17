import type { ReactNode } from "react";

export function ImpactSection({
  title,
  emptyText,
  items,
}: {
  title: string;
  emptyText: string;
  items: { key: string; content: ReactNode }[];
}) {
  return (
    <div className="mb-4">
      <h3 className="mb-1 text-sm font-medium text-gray-700">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400">{emptyText}</p>
      ) : (
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.key} className="rounded-md border border-gray-100 bg-gray-50 p-2 text-sm text-gray-700">
              {item.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
