import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { changeOrderStatusAction, deleteOrderAction } from "../actions";
import { ALLOWED_ORDER_TRANSITIONS, ORDER_STATUS_LABEL, STATUSES_REQUIRING_CONFIRM } from "../constants";
import type { Order } from "@prisma/client";

export function OrderStatusActions({ projectId, order }: { projectId: string; order: Order }) {
  const nextStatuses = ALLOWED_ORDER_TRANSITIONS[order.status];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {nextStatuses.map((next) => (
        <ConfirmSubmitButton
          key={next}
          label={`שינוי → ${ORDER_STATUS_LABEL[next]}`}
          confirmMessage={
            STATUSES_REQUIRING_CONFIRM.includes(next)
              ? `לעדכן את סטטוס ההזמנה ל"${ORDER_STATUS_LABEL[next]}"? זו פעולה מכוונת שתשפיע על מעקב ההזמנה.`
              : undefined
          }
          onRun={changeOrderStatusAction.bind(null, projectId, order.id, next)}
          variant={next === "CANCELLED" ? "danger" : "secondary"}
        />
      ))}
      {order.status === "DRAFT" && (
        <ConfirmSubmitButton
          label="מחיקת הזמנה"
          confirmMessage="למחוק את הטיוטה הזו לצמיתות?"
          onRun={deleteOrderAction.bind(null, projectId, order.id)}
          variant="danger"
        />
      )}
    </div>
  );
}
