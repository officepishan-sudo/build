"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  cancelChangeRequestAction,
  deleteDraftChangeRequestAction,
  markChangeDoneAction,
  moveChangeStatusAction,
  rejectChangeRequestAction,
} from "../actions";

// יוניון מקומי במקום ייבוא ChangeStatus מ-@prisma/client - קובץ 'use client'
// לא מייבא מודול צד-שרת (ראו קונבנציית decision-quick-actions.tsx).
type ChangeStatus = "DRAFT" | "CLARIFICATION" | "PROPOSED" | "APPROVAL" | "APPROVED" | "REJECTED" | "DONE" | "CANCELLED";
import { ChangeApproveConfirm } from "./change-approve-confirm";

export function ChangeStatusActions({
  projectId,
  id,
  status,
}: {
  projectId: string;
  id: string;
  status: ChangeStatus;
}) {
  const [isPending, startTransition] = useTransition();
  const run = (fn: () => Promise<unknown>) => startTransition(() => void fn());

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === "DRAFT" && (
        <>
          <Button type="button" variant="secondary" disabled={isPending} onClick={() => run(() => moveChangeStatusAction(projectId, id, "CLARIFICATION"))}>
            להעביר לבירור
          </Button>
          <Button type="button" variant="secondary" disabled={isPending} onClick={() => run(() => moveChangeStatusAction(projectId, id, "PROPOSED"))}>
            סמן כהוצע
          </Button>
          <Button type="button" variant="danger" disabled={isPending} onClick={() => run(() => deleteDraftChangeRequestAction(projectId, id))}>
            מחיקת טיוטה
          </Button>
        </>
      )}
      {status === "CLARIFICATION" && (
        <Button type="button" variant="secondary" disabled={isPending} onClick={() => run(() => moveChangeStatusAction(projectId, id, "PROPOSED"))}>
          סמן כהוצע
        </Button>
      )}
      {status === "PROPOSED" && (
        <>
          <Button type="button" variant="secondary" disabled={isPending} onClick={() => run(() => moveChangeStatusAction(projectId, id, "CLARIFICATION"))}>
            עדיין לא ברור - חזרה לבירור
          </Button>
          <Button type="button" variant="secondary" disabled={isPending} onClick={() => run(() => moveChangeStatusAction(projectId, id, "APPROVAL"))}>
            להעביר לאישור
          </Button>
        </>
      )}
      {status === "APPROVAL" && (
        <>
          <ChangeApproveConfirm projectId={projectId} id={id} />
          <Button type="button" variant="danger" disabled={isPending} onClick={() => run(() => rejectChangeRequestAction(projectId, id))}>
            דחייה
          </Button>
        </>
      )}
      {status === "APPROVED" && (
        <Button type="button" disabled={isPending} onClick={() => run(() => markChangeDoneAction(projectId, id))}>
          סימון כבוצע
        </Button>
      )}
      {(status === "DRAFT" || status === "CLARIFICATION" || status === "PROPOSED" || status === "APPROVAL") && (
        <Button type="button" variant="ghost" disabled={isPending} onClick={() => run(() => cancelChangeRequestAction(projectId, id))}>
          ביטול השינוי
        </Button>
      )}
    </div>
  );
}
