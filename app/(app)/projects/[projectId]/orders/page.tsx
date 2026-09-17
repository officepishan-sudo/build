import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { OrdersTable } from "@/features/orders/components/orders-table";
import { listOrdersForProject } from "@/features/orders/service";

export default async function OrdersPage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();
  const { projectId } = params;
  const orders = await listOrdersForProject(session.userId, projectId);

  return (
    <div>
      <PageHeader title="הזמנות" description="הזמנות שנוצרו מהעגלה, לפי ספק." />
      {orders.length === 0 ? (
        <EmptyState
          title="אין עדיין הזמנות"
          description="הזמנות נוצרות מהעגלה - סמנו פריטים עם ספק וכמות ולחצו על יצירת הזמנה."
          action={
            <Link href={`/projects/${projectId}/cart`} className="text-brand-600 hover:underline">
              לעגלת הפרויקט
            </Link>
          }
        />
      ) : (
        <Card>
          <OrdersTable projectId={projectId} orders={orders} />
        </Card>
      )}
    </div>
  );
}
