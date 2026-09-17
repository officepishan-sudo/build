import { EmptyState } from "@/components/ui/states";
import { ProfessionalCard } from "./professional-card";
import { listProfessionals } from "../service";
import type { ProfessionalFilterInput } from "../schema";

export async function ProfessionalList({ filter }: { filter: ProfessionalFilterInput }) {
  const professionals = await listProfessionals(filter);
  const hasFilter = Boolean(filter.field || filter.area);

  if (professionals.length === 0) {
    return (
      <EmptyState
        title="לא נמצאו בעלי מקצוע"
        description={
          hasFilter
            ? "נסו להרחיב את החיפוש - הסירו את הסינון לפי תחום או אזור."
            : "עדיין אין בעלי מקצוע במאגר - אפשר להוסיף את הראשון למטה."
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {professionals.map((professional) => (
        <ProfessionalCard key={professional.id} professional={professional} />
      ))}
    </div>
  );
}
