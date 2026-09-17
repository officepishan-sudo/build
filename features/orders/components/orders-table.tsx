import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE } from "../constants";
import type { Order, OrderItem, Supplier } from "@prisma/client";

type OrderRow = Order & { supplier: Supplier | null; items: OrderItem[]; phaseName: string | null };

export function OrdersTable({ projectId, orders }: { projectId: string; orders: OrderRow[] }) {
  return (
    <table className="w-full text-right text-sm">
      <thead className="border-b border-gray-200 text-xs text-gray-500">
        <tr>
          <th className="p-2 font-normal">מספר הזמנה</th>
          <th className="p-2 font-normal">ספק</th>
          <th className="p-2 font-normal">פריטים</th>
          <th className="p-2 font-normal">סכום</th>
          <th className="p-2 font-normal">שלב</th>
          <th className="p-2 font-normal">סטטוס</th>
          <th className="p-2 font-normal">תאריך</th>
          <th className="p-2 font-normal"> </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {orders.map((order) => (
          <tr key={order.id}>
            <td className="p-2 font-medium text-gray-900">{order.number}</td>
            <td className="p-2 text-gray-700">{order.supplier?.name ?? "לא נבחר"}</td>
            <td className="p-2 text-gray-700">{order.items.length}</td>
            <td className="p-2 text-gray-700">{formatCurrency(order.totalAmount as unknown as number)}</td>
            <td className="p-2 text-gray-500">{order.phaseName ?? "לא משויך"}</td>
            <td className="p-2">
              <Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>
            </td>
            <td className="p-2 text-gray-500">{formatDate(order.orderDate)}</td>
            <td className="p-2">
              <Link href={`/projects/${projectId}/orders/${order.id}`} className="text-brand-600 hover:underline">
                פתח הזמנה
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
