import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { NeedsCheckBadge } from "@/components/ui/states";
import { formatCurrency, formatDate } from "@/lib/format";
import { PAYMENT_STATUS_LABEL, PAYMENT_STATUS_TONE } from "../constants";
import type { PaymentSummary } from "../service";
import { PaymentStatusForm } from "./payment-status-form";
import type { PaymentStatus } from "@prisma/client";

export function PaymentRow({ projectId, payment }: { projectId: string; payment: PaymentSummary }) {
  return (
    <li className="space-y-2 py-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium text-gray-900">{payment.payeeName}</p>
          <p className="text-sm text-gray-500">על: {payment.subjectLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          {payment.isOverdue && <NeedsCheckBadge label="באיחור" />}
          <Badge tone={PAYMENT_STATUS_TONE[payment.status as PaymentStatus]}>
            {PAYMENT_STATUS_LABEL[payment.status as PaymentStatus]}
          </Badge>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
        <span>סכום: {formatCurrency(payment.amount)}</span>
        {payment.dueDate && <span>מועד יעד: {formatDate(payment.dueDate)}</span>}
        {payment.paidDate && <span>שולם בתאריך: {formatDate(payment.paidDate)}</span>}
        {payment.documentId && (
          <Link href={`/projects/${projectId}/documents`} className="text-brand-600 hover:underline">
            מסמך משויך
          </Link>
        )}
      </div>
      <PaymentStatusForm projectId={projectId} paymentId={payment.id} status={payment.status as PaymentStatus} />
    </li>
  );
}
