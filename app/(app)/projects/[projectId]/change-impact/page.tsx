import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { ErrorState } from "@/components/ui/states";
import { ChangeImpactReview } from "@/features/change-impact/components/change-impact-review";
import { changeImpactQuerySchema } from "@/features/change-impact/schema";
import { reviewChangeImpact } from "@/features/change-impact/service";

export default async function ChangeImpactPage({
  params,
  searchParams,
}: {
  params: { projectId: string };
  searchParams: Record<string, string | undefined>;
}) {
  const session = await requireSession();

  if (!searchParams.changeDescription) {
    return (
      <div>
        <PageHeader title="בדיקת השפעת שינוי" />
        <ErrorState title="חסר תיאור שינוי" description="מסך זה נפתח מתוך פעולה אחרת שמתארת מה משתנה - אין מה להציג בפני עצמו." />
      </div>
    );
  }

  const query = changeImpactQuerySchema.parse(searchParams);
  const impact = await reviewChangeImpact(session.userId, params.projectId, searchParams);

  return (
    <div>
      <PageHeader
        title="בדיקת השפעת שינוי"
        description="מציג מה השינוי הזה נוגע בו לפני שמאשרים - שום דבר לא משתנה בלי אישור מפורש."
      />
      <ChangeImpactReview projectId={params.projectId} query={query} impact={impact} returnTo={searchParams.returnTo} />
    </div>
  );
}
