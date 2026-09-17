"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { usePlaySandbox, type PlaySandboxInitial } from "../hooks/use-play-sandbox";

export function PlaySandbox({
  projectId,
  alternativeId,
  title,
  initial,
  changeImpactHref,
}: {
  projectId: string;
  alternativeId: string;
  title: string;
  initial: PlaySandboxInitial;
  changeImpactHref: string;
}) {
  const sandbox = usePlaySandbox(projectId, alternativeId, initial);

  return (
    <div className="max-w-lg">
      <Card>
        <h2 className="mb-3 font-medium text-gray-900">{title} - ניסוי בלי מחויבות</h2>

        <label htmlFor="budgetLevel" className="mb-1 block text-sm font-medium text-gray-700">
          רמת תקציב / איכות גימור: {sandbox.budgetLevel}
        </label>
        <input
          id="budgetLevel"
          type="range"
          min={1}
          max={5}
          value={sandbox.budgetLevel}
          onChange={(e) => sandbox.setBudgetLevel(Number(e.target.value))}
          className="w-full"
        />

        <div className="mt-4 rounded-md bg-gray-50 p-3 text-sm">
          <p>
            אומדן מחיר חי: <strong>{formatCurrency(sandbox.live.priceMin)}</strong> - <strong>{formatCurrency(sandbox.live.priceMax)}</strong>
          </p>
          {initial.durationDays != null && <p className="mt-1 text-gray-500">זמן משוער: {initial.durationDays} ימים (ללא שינוי בהערכה הבסיסית)</p>}
        </div>

        <label htmlFor="maintenanceNotes" className="mb-1 mt-4 block text-sm font-medium text-gray-700">
          הערות תחזוקה/איכות
        </label>
        <textarea
          id="maintenanceNotes"
          rows={3}
          value={sandbox.maintenanceNotes}
          onChange={(e) => sandbox.setMaintenanceNotes(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />

        {sandbox.applied && <p className="mt-3 text-sm text-green-700">הנתונים עודכנו על החלופה, עם תיעוד שינוי.</p>}

        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" disabled={sandbox.isPending} onClick={sandbox.apply}>
            {sandbox.isPending ? "מחיל..." : "החל על החלופה"}
          </Button>
          <Button type="button" variant="secondary" onClick={sandbox.reset}>
            איפוס
          </Button>
          <Link href={changeImpactHref}>
            <Button type="button" variant="ghost">
              זהו שינוי משמעותי - בדיקת השפעה
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
