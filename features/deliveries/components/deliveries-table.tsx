import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { ALLOWED_DELIVERY_TRANSITIONS, DELIVERY_STATUS_LABEL, DELIVERY_STATUS_TONE } from "../constants";
import { DeliveryStatusActions } from "./delivery-status-actions";
import type { Delivery, Order, Phase, Supplier } from "@prisma/client";

type DeliveryRow = Delivery & { order: Order | null; phase: Phase | null; supplier: Supplier | null; isLate: boolean };

export function DeliveriesTable({ projectId, deliveries }: { projectId: string; deliveries: DeliveryRow[] }) {
  return (
    <table className="w-full text-right text-sm">
      <thead className="border-b border-gray-200 text-xs text-gray-500">
        <tr>
          <th className="p-2 font-normal">פריטים</th>
          <th className="p-2 font-normal">ספק</th>
          <th className="p-2 font-normal">מקור</th>
          <th className="p-2 font-normal">שלב</th>
          <th className="p-2 font-normal">צפוי</th>
          <th className="p-2 font-normal">בפועל</th>
          <th className="p-2 font-normal">סטטוס</th>
          <th className="p-2 font-normal">עדכון</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {deliveries.map((d) => (
          <tr key={d.id}>
            <td className="p-2 text-gray-900">{d.itemsSummary ?? "—"}</td>
            <td className="p-2 text-gray-700">{d.supplier?.name ?? "לא נבחר"}</td>
            <td className="p-2 text-gray-700">
              {d.order ? (
                <Link href={`/projects/${projectId}/orders/${d.order.id}`} className="text-brand-600 hover:underline">
                  {d.order.number}
                </Link>
              ) : (
                "—"
              )}
            </td>
            <td className="p-2 text-gray-700">{d.phase?.name ?? "לא משויך"}</td>
            <td className="p-2 text-gray-500">
              {formatDate(d.expectedDate)}
              {d.isLate && (
                <span className="mr-2">
                  <Badge tone="danger">אספקה מאוחרת</Badge>
                </span>
              )}
            </td>
            <td className="p-2 text-gray-500">{d.receivedDate ? formatDate(d.receivedDate) : "טרם נקבע"}</td>
            <td className="p-2">
              <Badge tone={DELIVERY_STATUS_TONE[d.status]}>{DELIVERY_STATUS_LABEL[d.status]}</Badge>
            </td>
            <td className="p-2">
              <DeliveryStatusActions projectId={projectId} deliveryId={d.id} nextStatuses={ALLOWED_DELIVERY_TRANSITIONS[d.status]} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
