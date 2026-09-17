import Link from "next/link";
import { EmptyState } from "@/components/ui/states";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { listQuantityBoard } from "../service";
import { QuantityFilterBar } from "./quantity-filter-bar";
import { QuantityTable } from "./quantity-table";
import { AddQuantityItem } from "./add-quantity-item";

export async function QuantitiesScreen({
  userId,
  projectId,
  searchParams,
}: {
  userId: string;
  projectId: string;
  searchParams: { category?: string; phaseId?: string };
}) {
  const board = await listQuantityBoard(userId, projectId, searchParams);
  const hasAnyItems = board.items.length > 0;
  const hasFilters = Boolean(board.filters.category || board.filters.phaseId);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-brand-200 bg-brand-50 px-4 py-3">
        <span className="text-sm text-brand-900">סה״כ כתב כמויות</span>
        <span className="text-lg font-semibold text-brand-900">{formatCurrency(board.grandTotal)}</span>
        <Link href={`/projects/${projectId}/quote-requests/new`}>
          <Button variant="secondary">בקשת הצעה</Button>
        </Link>
      </div>

      {(board.categories.length > 0 || board.phases.length > 0) && (
        <QuantityFilterBar categories={board.categories} phases={board.phases} current={board.filters} />
      )}

      {!hasAnyItems && !hasFilters && (
        <EmptyState
          title="עדיין אין שורות בכתב הכמויות"
          description="הוסיפו שורה ידנית כדי להתחיל לרכז עבודה וחומרים - אפשר להשלים פרטים חסרים בהמשך."
        />
      )}

      {!hasAnyItems && hasFilters && (
        <EmptyState title="אין שורות התואמות את הסינון" description="נסו להסיר את הסינון או לבחור קטגוריה/שלב אחרים." />
      )}

      {hasAnyItems && (
        <QuantityTable projectId={projectId} items={board.items} phases={board.phases} categories={board.categories} />
      )}

      <AddQuantityItem projectId={projectId} phases={board.phases} categories={board.categories} />
    </div>
  );
}
