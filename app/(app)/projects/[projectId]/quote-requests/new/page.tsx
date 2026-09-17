import { requireSession } from "@/lib/auth/session";
import { requireProjectAccess } from "@/lib/auth/rbac";
import { PageHeader } from "@/components/ui/page-header";
import { QuoteRequestForm } from "@/features/quote-requests/components/quote-request-form";
import { listProfessionalOptions, listSupplierOptions } from "@/lib/db/directory-lookups";

export default async function NewQuoteRequestPage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();
  await requireProjectAccess(params.projectId, session.userId, "MANAGE");

  const [professionals, suppliers] = await Promise.all([listProfessionalOptions(), listSupplierOptions()]);

  return (
    <div>
      <PageHeader
        title="בקשת הצעת מחיר חדשה"
        description="מלאו את הפרטים, בחרו נמענים, ואז שמרו כטיוטה לתצוגה מקדימה או שלחו ישירות."
      />
      <QuoteRequestForm projectId={params.projectId} professionals={professionals} suppliers={suppliers} />
    </div>
  );
}
