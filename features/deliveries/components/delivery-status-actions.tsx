import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";
import { updateDeliveryStatusAction } from "../actions";
import { DELIVERY_STATUS_LABEL } from "../constants";
import type { DeliveryStatus } from "@prisma/client";

const CONFIRM_REQUIRED: DeliveryStatus[] = ["RECEIVED", "CANCELLED"];

export function DeliveryStatusActions({
  projectId,
  deliveryId,
  nextStatuses,
}: {
  projectId: string;
  deliveryId: string;
  nextStatuses: DeliveryStatus[];
}) {
  if (nextStatuses.length === 0) return <span className="text-xs text-gray-400">אין פעולה נוספת</span>;

  return (
    <div className="flex flex-wrap gap-1">
      {nextStatuses.map((next) => (
        <ConfirmSubmitButton
          key={next}
          label={DELIVERY_STATUS_LABEL[next]}
          confirmMessage={CONFIRM_REQUIRED.includes(next) ? `לעדכן את סטטוס האספקה ל"${DELIVERY_STATUS_LABEL[next]}"?` : undefined}
          onRun={updateDeliveryStatusAction.bind(null, projectId, deliveryId, next)}
          variant={next === "CANCELLED" ? "danger" : "secondary"}
        />
      ))}
    </div>
  );
}
