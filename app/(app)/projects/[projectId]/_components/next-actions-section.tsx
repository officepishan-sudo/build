import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { RecommendedAction } from "../_lib/recommended-actions";

export function NextActionsSection({ actions }: { actions: RecommendedAction[] }) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-sm font-semibold text-gray-700">הצעדים הבאים המומלצים</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => (
          <Link key={action.href + action.label} href={action.href}>
            <Card className="h-full border-brand-200 bg-brand-50/40 transition hover:border-brand-400 hover:shadow-md">
              <p className="text-sm font-medium text-gray-900">{action.label}</p>
              <p className="mt-1 text-xs text-gray-500">{action.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
