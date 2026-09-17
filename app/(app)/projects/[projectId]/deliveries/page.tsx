import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { DeliveriesTable } from "@/features/deliveries/components/deliveries-table";
import { listDeliveriesForProject } from "@/features/deliveries/service";

export default async function DeliveriesPage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();
  const { projectId } = params;
  const deliveries = await listDeliveriesForProject(session.userId, projectId);

  return (
    <div>
      <PageHeader title="אספקות" description="מעקב אספקות בהקשר של שלב, מקור ההזמנה והספק." />
      {deliveries.length === 0 ? (
        <EmptyState
          title="אין עדיין אספקות"
          description="אספקה נוצרת מתוך הזמנה קיימת."
          action={
            <Link href={`/projects/${projectId}/orders`} className="text-brand-600 hover:underline">
              להזמנות
            </Link>
          }
        />
      ) : (
        <Card>
          <DeliveriesTable projectId={projectId} deliveries={deliveries} />
        </Card>
      )}
    </div>
  );
}
