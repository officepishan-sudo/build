import { EmptyState } from "@/components/ui/states";
import { AlternativeCard } from "./alternative-card";
import { AlternativeForm } from "./alternative-form";
import { listAlternatives } from "../service";

export async function AlternativesList({ userId, projectId }: { userId: string; projectId: string }) {
  const alternatives = await listAlternatives(userId, projectId);

  return (
    <div>
      {alternatives.length === 0 ? (
        <EmptyState
          title="עדיין אין חלופות לפרויקט הזה"
          description="אין כרגע מנוע אוטומטי שמייצר חלופות (אין חיבור ל-AI או למאגר מחירי שוק) - אפשר להוסיף חלופה ידנית כדי להתחיל להשוות."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {alternatives.map((alt) => (
            <AlternativeCard key={alt.id} alternative={alt} projectId={projectId} />
          ))}
        </div>
      )}

      <details className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <summary className="cursor-pointer text-sm font-medium text-brand-700">הוספת חלופה ידנית</summary>
        <div className="mt-4">
          <AlternativeForm projectId={projectId} />
        </div>
      </details>
    </div>
  );
}
