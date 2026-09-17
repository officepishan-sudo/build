"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { updateIssueStatusAction } from "../actions";

// יוניון מקומי במקום ייבוא IssueStatus מ-@prisma/client - קובץ 'use client'.
type IssueStatus = "OPEN" | "IN_PROGRESS" | "WAITING" | "RESOLVED" | "CLOSED";

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
