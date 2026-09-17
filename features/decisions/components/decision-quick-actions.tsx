"use client";

import { useTransition } from "react";
import { markNeedsCheckAction, markOpenAction } from "../actions";
import { Button } from "@/components/ui/button";

export function DecisionQuickActions({
  projectId,
  decisionId,
  status,
}: {
  projectId: string;
  decisionId: string;
  status: "OPEN" | "DECIDED" | "NEEDS_CHECK";
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      {status !== "NEEDS_CHECK" && (
        <Button
          type="button"
          variant="secondary"
          disabled={isPending}
          onClick={() => startTransition(() => markNeedsCheckAction(projectId, decisionId))}
        >
          לא יודע - צריך בדיקה
        </Button>
      )}
      {status !== "OPEN" && (
        <Button
          type="button"
          variant="ghost"
          disabled={isPending}
          onClick={() => startTransition(() => markOpenAction(projectId, decisionId))}
        >
          השאר פתוח
        </Button>
      )}
    </div>
  );
}
