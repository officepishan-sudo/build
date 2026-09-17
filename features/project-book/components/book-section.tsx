import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { EmptyState, PartialBanner } from "@/components/ui/states";

/**
 * סעיף גנרי בספר הפרויקט - קורא/מונה/מקשר בלבד, בלי עריכה (P36 הוא תצוגה בלבד).
 * משמש לכל דומיין (החלטות, הצעות, תשלומים וכו') כדי שלא נשכפל את אותה תבנית 8 פעמים.
 */
export function BookSection<T extends { id: string }>({
  title,
  items,
  count,
  failed,
  emptyDescription,
  seeAllHref,
  seeAllLabel = "פתיחת המסך המלא",
  renderItem,
}: {
  title: string;
  items: T[];
  count: number;
  failed: boolean;
  emptyDescription: string;
  seeAllHref: string;
  seeAllLabel?: string;
  renderItem: (item: T) => ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold text-gray-700">
        {title} {!failed && `(${count})`}
      </h2>
      <Card>
        {failed && <PartialBanner missing={`טעינת ${title}`} />}
        {!failed && items.length === 0 && <EmptyState title="אין עדיין פריטים" description={emptyDescription} />}
        {!failed && items.length > 0 && (
          <ul className="mb-3 divide-y divide-gray-100">
            {items.map((item) => (
              <li key={item.id} data-book-item className="py-2 text-sm">
                {renderItem(item)}
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center gap-2">
          <Link href={seeAllHref} className="text-xs font-medium text-brand-700 hover:underline">
            {seeAllLabel} ←
          </Link>
          {!failed && count > items.length && (
            <span className="text-xs text-gray-400">
              (מוצגים {items.length} מתוך {count})
            </span>
          )}
        </div>
      </Card>
    </section>
  );
}
