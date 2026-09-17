import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { getProfessionalProfile } from "@/features/professionals/service";
import { ProfessionalProfileView } from "@/features/professionals/components/professional-profile-view";

export default async function ProfessionalProfilePage({ params }: { params: { professionalId: string } }) {
  await requireSession();
  const professional = await getProfessionalProfile(params.professionalId);

  if (!professional) {
    return <p className="text-gray-500">בעל המקצוע לא נמצא.</p>;
  }

  return (
    <div>
      <PageHeader title={professional.name} description="פרופיל בעל מקצוע - נתונים בלבד, בלי מסקנה מומלצת של המערכת." />
      <ProfessionalProfileView professional={professional} />
    </div>
  );
}
