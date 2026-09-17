"use client";

import { useState, useTransition } from "react";
import { confirmSelectAlternativeAction } from "../actions";
import { Button } from "@/components/ui/button";
import { ConflictBanner } from "@/components/ui/states";
import type { ChangeImpactResult } from "@/lib/change-impact";

export function SelectionConfirm({
  projectId,
  alternativeId,
  title,
  isSelected,
  impact,
}: {
  projectId: string;
  alternativeId: string;
  title: string;
  isSelected: boolean;
  impact: ChangeImpactResult | null;
}) {
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
      {impact && impact.needsReviewCount > 0 && (
        <ConflictBanner
          message={`יש בפרויקט ${impact.quotesNoLongerValid.length} הצעות מחיר ו-${impact.ordersWithCommitments.length} הזמנות שעלולות להיות מושפעות מבחירת "${title}".`}
        />
      )}
      {impact && (
        <a
          href={`/projects/${projectId}/change-impact?changeDescription=${encodeURIComponent(`בחירת חלופה: ${title}`)}&affectedQuoteIds=${impact.quotesNoLongerValid.map((q) => q.id).join(",")}&affectedOrderIds=${impact.ordersWithCommitments.map((o) => o.id).join(",")}`}
          className="mt-2 inline-block text-sm text-brand-700 underline"
        >
          לצפייה מלאה בהשפעת השינוי לפני אישור
        </a>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="סיבה לבחירה (לא חובה)"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <Button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => confirmSelectAlternativeAction(projectId, alternativeId, reason))}
        >
          {isPending ? "מאשר..." : isSelected ? "אושרה - בחירה מחדש" : "אשר בחירת חלופה זו"}
        </Button>
      </div>
      <p className="mt-2 text-xs text-gray-400">הבחירה אינה סופית - אפשר לשנות אותה בהמשך, תמיד דרך אישור מפורש כזה.</p>
    </div>
  );
}
