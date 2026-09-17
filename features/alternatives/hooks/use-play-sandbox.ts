"use client";

import { useMemo, useState, useTransition } from "react";
import { applyPlayChangesAction } from "../actions";

export type PlaySandboxInitial = {
  priceMin: number;
  priceMax: number;
  durationDays: number | null;
  maintenanceNotes: string | null;
};

const BASELINE_LEVEL = 3;
const PCT_PER_LEVEL = 0.1; // כל רמה מעל/מתחת ל-3 משנה את האומדן ב-10% - חשבון אריתמטי פשוט, לא מנוע הנדסי.

function estimateForLevel(base: number, level: number): number {
  const multiplier = 1 + (level - BASELINE_LEVEL) * PCT_PER_LEVEL;
  return Math.round(base * multiplier);
}

/**
 * ארגז חול "שחק עם התוצאה" (P08): כל שינוי הוא הצעה מקומית בלבד עד "החל" -
 * שום קריאת שרת לא יוצאת עד אז (סעיף Edge Cases: לא auto-commit על כל הקשה).
 */
export function usePlaySandbox(projectId: string, alternativeId: string, initial: PlaySandboxInitial) {
  const [budgetLevel, setBudgetLevel] = useState(BASELINE_LEVEL);
  const [maintenanceNotes, setMaintenanceNotes] = useState(initial.maintenanceNotes ?? "");
  const [applied, setApplied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const live = useMemo(
    () => ({
      priceMin: estimateForLevel(initial.priceMin, budgetLevel),
      priceMax: estimateForLevel(initial.priceMax, budgetLevel),
    }),
    [initial.priceMin, initial.priceMax, budgetLevel],
  );

  function reset() {
    setBudgetLevel(BASELINE_LEVEL);
    setMaintenanceNotes(initial.maintenanceNotes ?? "");
    setApplied(false);
  }

  function apply() {
    startTransition(async () => {
      await applyPlayChangesAction(projectId, alternativeId, {
        priceMin: live.priceMin,
        priceMax: live.priceMax,
        durationDays: initial.durationDays ?? undefined,
        maintenanceNotes,
      });
      setApplied(true);
    });
  }

  return { budgetLevel, setBudgetLevel, maintenanceNotes, setMaintenanceNotes, live, isPending, applied, reset, apply };
}
