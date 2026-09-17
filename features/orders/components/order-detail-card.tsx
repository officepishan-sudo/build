import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE } from "../constants";
import { OrderStatusActions } from "./order-status-actions";
import type { Order, OrderItem, Supplier, Professional, Delivery } from "@prisma/client";

type OrderDetail = Order & {
  supplier: Supplier | null;
  professional: Professional | null;
  items: OrderItem[];
  deliveries: Delivery[];
  phaseName: string | null;
};

export function OrderDetailCard({ projectId, order }: { projectId: string; order: OrderDetail }) {
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{order.number}</h2>
            <p className="text-sm text-gray-500">
              ספק: {order.supplier?.name ?? "לא נבחר"} · שלב: {order.phaseName ?? "לא משויך"} · נפתחה{" "}
              {formatDateTime(order.orderDate)}
            </p>
          </div>
          <Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>
        </div>
        <p className="mt-3 text-sm text-gray-700">סכום כולל: {formatCurrency(order.totalAmount as unknown as number)}</p>
      </Card>

      <Card>
        <h3 className="mb-3 font-medium text-gray-900">פריטי ההזמנה</h3>
        <table className="w-full text-right text-sm">
          <thead className="text-xs text-gray-500">
            <tr>
              <th className="p-1 font-normal">תיאור</th>
              <th className="p-1 font-normal">כמות</th>
              <th className="p-1 font-normal">מחיר יח&apos;</th>
              <th className="p-1 font-normal">סה&quot;כ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="p-1 text-gray-900">{item.description}</td>
                <td className="p-1 text-gray-700">{Number(item.quantity)}</td>
                <td className="p-1 text-gray-700">{formatCurrency(item.unitPrice as unknown as number)}</td>
                <td className="p-1 text-gray-700">{formatCurrency(item.totalPrice as unknown as number)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card>
        <h3 className="mb-3 font-medium text-gray-900">שינוי סטטוס</h3>
        <OrderStatusActions projectId={projectId} order={order} />
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">אספקות מהזמנה זו</h3>
          <Link href={`/projects/${projectId}/orders/${order.id}/deliver`}>
            <Button variant="secondary">אספקה חדשה</Button>
          </Link>
        </div>
        {order.deliveries.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">עדיין לא נוצרה אספקה מהזמנה זו.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {order.deliveries.map((d) => (
              <li key={d.id}>
                <Link href={`/projects/${projectId}/deliveries`} className="text-brand-600 hover:underline">
                  אספקה מ-{formatDateTime(d.createdAt)}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
