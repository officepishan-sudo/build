"use client";

import { useState, useTransition } from "react";
import { pauseProjectAction, resumeProjectAction } from "@/features/projects/actions";
import { Button } from "@/components/ui/button";

// הפעולה נעשית ישירות מ-features/projects/actions (אותה משפחת פיצ'ר, לא חצייה בין פיצ'רים) -
// קריאה ישירה לפונקציית server action מרכיב client, בלי form action, כי יש צורך בקלט אופציונלי (סיבת השהיה).
export function PauseResumePanel({ projectId, isPaused }: { projectId: string; isPaused: boolean }) {
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  if (isPaused) {
    return (
      <Button
        type="button"
        variant="secondary"
        disabled={isPending}
        onClick={() => startTransition(() => resumeProjectAction(projectId))}
      >
        {isPending ? "מחדש..." : "המשך פרויקט"}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="סיבת השהיה (לא חובה)"
        className="rounded-md border border-gray-300 px-2 py-1 text-sm"
      />
      <Button
        type="button"
        variant="secondary"
        disabled={isPending}
        onClick={() => startTransition(() => pauseProjectAction(projectId, reason || undefined))}
      >
        {isPending ? "משהה..." : "השהיית פרויקט"}
      </Button>
    </div>
  );
}
