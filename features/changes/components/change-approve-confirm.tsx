"use client";

import { useState, useTransition } from "react";
import { approveChangeRequestAction } from "../actions";
import { Button } from "@/components/ui/button";

// "אשר" חייב להיות פעולה מכוונת עם שלב אישור - לא לחיצה אחת שמבצעת מיד.
export function ChangeApproveConfirm({ projectId, id }: { projectId: string; id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <Button type="button" onClick={() => setConfirming(true)}>
        אשר שינוי
      </Button>
    );
  }

  return (
    <div className="space-y-2 rounded-md border border-green-200 bg-green-50 p-3">
      <p className="text-sm text-green-900">לאשר את השינוי סופית? הפעולה תעביר אותו לסטטוס &quot;אושר&quot;.</p>
      <div className="flex gap-2">
        <Button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => approveChangeRequestAction(projectId, id))}
        >
          {isPending ? "מאשר..." : "אשר סופית"}
        </Button>
        <Button type="button" variant="ghost" disabled={isPending} onClick={() => setConfirming(false)}>
          ביטול
        </Button>
      </div>
    </div>
  );
}
