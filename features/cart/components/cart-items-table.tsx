import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { deleteCartItemAction } from "../actions";
import type { CartItem, Product, Supplier } from "@prisma/client";

type CartRow = CartItem & { supplier: Supplier | null; product: Product | null };

function estimatedDelivery(item: CartRow): string {
  if (!item.product?.deliveryLeadDays) return "לא ידוע עדיין";
  return `כ-${item.product.deliveryLeadDays} ימים מרגע ההזמנה`;
}

export function CartItemsTable({ projectId, items }: { projectId: string; items: CartRow[] }) {
  return (
    <table className="w-full text-right text-sm">
      <thead className="border-b border-gray-200 text-xs text-gray-500">
        <tr>
          <th className="p-2 font-normal"> </th>
          <th className="p-2 font-normal">פריט</th>
          <th className="p-2 font-normal">כמות</th>
          <th className="p-2 font-normal">ספק</th>
          <th className="p-2 font-normal">מחיר יח&apos;</th>
          <th className="p-2 font-normal">אספקה משוערת</th>
          <th className="p-2 font-normal"> </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {items.map((item) => (
          <tr key={item.id}>
            <td className="p-2">
              <input type="checkbox" name="cartItemId" value={item.id} className="h-4 w-4" />
            </td>
            <td className="p-2 text-gray-900">{item.description}</td>
            <td className="p-2 text-gray-700">{Number(item.quantity)}</td>
            <td className="p-2 text-gray-700">{item.supplier?.name ?? "לא נבחר"}</td>
            <td className="p-2 text-gray-700">{formatCurrency(item.unitPrice as unknown as number | null)}</td>
            <td className="p-2 text-gray-500">{estimatedDelivery(item)}</td>
            <td className="whitespace-nowrap p-2">
              <Link href={`/projects/${projectId}/cart/${item.id}/edit`} className="ml-3 text-brand-600 hover:underline">
                שנה ספק/כמות
              </Link>
              <Link href={`/projects/${projectId}/cart/${item.id}/split`} className="ml-3 text-brand-600 hover:underline">
                פצל
              </Link>
              <button
                type="submit"
                formAction={deleteCartItemAction.bind(null, projectId, item.id)}
                className="text-red-600 hover:underline"
              >
                הסר
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
