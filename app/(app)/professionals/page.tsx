import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { ProfessionalFilterForm } from "@/features/professionals/components/professional-filter-form";
import { ProfessionalList } from "@/features/professionals/components/professional-list";
import { CreateProfessionalForm } from "@/features/professionals/components/create-professional-form";

export default async function ProfessionalsPage({
  searchParams,
}: {
  searchParams: { field?: string; area?: string };
}) {
  await requireSession();

  return (
    <div>
      <PageHeader
        title="בעלי מקצוע"
        description="איתור והשוואת בעלי מקצוע לפי תחום ואזור, זמינות, ניסיון וביקורות - בלי דירוג כללי של המערכת."
      />
      <ProfessionalFilterForm field={searchParams.field} area={searchParams.area} />
      <ProfessionalList filter={{ field: searchParams.field, area: searchParams.area }} />
      <details className="mt-8 rounded-lg border border-gray-200 bg-white p-4">
        <summary className="cursor-pointer text-sm font-medium text-brand-700">הוספת בעל מקצוע חדש</summary>
        <div className="mt-4">
          <CreateProfessionalForm />
        </div>
      </details>
    </div>
  );
}
