"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { sendDefectForReviewAction, updateDefectStatusAction } from "../actions";

// יוניון מקומי במקום ייבוא DefectStatus מ-@prisma/client - קובץ 'use client'.
type DefectStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "IN_REVIEW" | "CLOSED";

// מעברים חופשיים בין OPEN/IN_PROGRESS + "העברה לבדיקה" (RESOLVED->IN_REVIEW,
// שלב ביניים אופציונלי). RESOLVED/CLOSED עצמם דורשים טופס עם הערה (ראו
// defect-note-form.tsx) ולא מגיעים דרך כאן.
export function DefectStatusActions({ projectId, id, status }: { projectId: string; id: string; status: DefectStatus }) {
  const [isPending, startTransition] = useTransition();

  if (status === "OPEN" || status === "IN_PROGRESS") {
    const other = status === "OPEN" ? "IN_PROGRESS" : "OPEN";
    const label = status === "OPEN" ? "סימון כבטיפול" : "החזרה לפתוח";
    return (
      <Button
        type="button"
        variant="secondary"
        disabled={isPending}
        onClick={() => startTransition(() => updateDefectStatusAction(projectId, id, other))}
      >
        {label}
      </Button>
    );
  }

  if (status === "RESOLVED") {
    return (
      <Button
        type="button"
        variant="secondary"
        disabled={isPending}
        onClick={() => startTransition(() => sendDefectForReviewAction(projectId, id))}
      >
        העברה לבדיקה
      </Button>
    );
  }

  return null;
}
