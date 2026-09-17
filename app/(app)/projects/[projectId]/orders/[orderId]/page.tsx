import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { OrderDetailCard } from "@/features/orders/components/order-detail-card";
import { NotFoundError } from "@/lib/errors";
import { getOrderDetail } from "@/features/orders/service";

export default async function OrderDetailPage({
  params,
}: {
  params: { projectId: string; orderId: string };
}) {
  const session = await requireSession();
  const { projectId, orderId } = params;

  try {
    const order = await getOrderDetail(session.userId, projectId, orderId);
    return (
      <div>
        <PageHeader title={`הזמנה ${order.number}`} />
        <OrderDetailCard projectId={projectId} order={order} />
      </div>
    );
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }
}
