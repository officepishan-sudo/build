"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * חיפוש טקסטי פשוט על פני כל הסעיפים - בלי אינדקס אמיתי (מספיק לספר פרויקט).
 * מקבל את הסעיפים כ-children (מרונדרים כבר בשרת) ומסנן ע"י הסתרת [data-book-item]
 * שלא תואמים - כך שאין צורך להעביר את כל נתוני הפרויקט לצד הלקוח.
 */
export function BookSearch({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const q = query.trim().toLowerCase();
    root.querySelectorAll<HTMLElement>("[data-book-item]").forEach((el) => {
      const matches = q === "" || (el.textContent ?? "").toLowerCase().includes(q);
      el.style.display = matches ? "" : "none";
    });
  }, [query]);

  return (
    <div>
      <label className="mb-4 block max-w-sm text-sm text-gray-700">
        חיפוש בכל סעיפי הספר
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="הקלידו טקסט לסינון..."
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </label>
      <div ref={containerRef} className="space-y-6">
        {children}
      </div>
    </div>
  );
}
