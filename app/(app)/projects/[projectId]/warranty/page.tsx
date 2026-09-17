import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { WarrantyScreen } from "@/features/warranty/components/warranty-screen";

export default async function ProjectWarrantyPage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader
        title="אחריות ותחזוקה"
        description="אחריות לפי פריט וספק, עם תאריך תפוגה מחושב, ותזכורות תחזוקה לאחר סיום הפרויקט."
      />
      <WarrantyScreen userId={session.userId} projectId={params.projectId} />
    </div>
  );
}
