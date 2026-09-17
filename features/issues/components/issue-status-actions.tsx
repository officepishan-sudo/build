"use client";

import { useTransition } from "react";
import type { IssueStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { updateIssueStatusAction } from "../actions";

const FREE_TRANSITIONS: { status: IssueStatus; label: string }[] = [
  { status: "OPEN", label: "פתוחה" },
  { status: "IN_PROGRESS", label: "בטיפול" },
  { status: "WAITING", label: "ממתינה" },
];

// עדכון סטטוס "רגיל" בלבד - בלי לגעת ב-RESOLVED/CLOSED, שדורשים הערת פתרון.
export function IssueStatusActions({ projectId, id, status }: { projectId: string; id: string; status: IssueStatus }) {
  const [isPending, startTransition] = useTransition();

  if (status === "RESOLVED" || status === "CLOSED") return null;

  return (
    <div className="flex flex-wrap gap-2">
      {FREE_TRANSITIONS.filter((t) => t.status !== status).map((t) => (
        <Button
          key={t.status}
          type="button"
          variant="secondary"
          disabled={isPending}
          onClick={() => startTransition(() => updateIssueStatusAction(projectId, id, t.status))}
        >
          עדכון סטטוס: {t.label}
        </Button>
      ))}
    </div>
  );
}
