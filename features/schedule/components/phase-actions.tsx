"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deletePhaseAction, movePhaseAction } from "../actions";
import { PhaseForm } from "./phase-form";
import type { PhaseWithTasks } from "../types";

export function PhaseActions({
  projectId,
  phase,
  otherPhases,
  isFirst,
  isLast,
}: {
  projectId: string;
  phase: PhaseWithTasks;
  otherPhases: PhaseWithTasks[];
  isFirst: boolean;
  isLast: boolean;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return <PhaseForm projectId={projectId} otherPhases={otherPhases} phase={phase} onDone={() => setEditing(false)} />;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ReorderButton projectId={projectId} phaseId={phase.id} direction="up" disabled={isFirst} label="הזזה למעלה" symbol="▲" />
      <ReorderButton projectId={projectId} phaseId={phase.id} direction="down" disabled={isLast} label="הזזה למטה" symbol="▼" />
      <Button type="button" variant="ghost" onClick={() => setEditing(true)}>
        ערוך שלב
      </Button>
      <form action={deletePhaseAction.bind(null, projectId, phase.id)}>
        <Button type="submit" variant="ghost" onClick={confirmDeletePhase}>
          מחיקת שלב
        </Button>
      </form>
    </div>
  );
}

function ReorderButton({
  projectId,
  phaseId,
  direction,
  disabled,
  label,
  symbol,
}: {
  projectId: string;
  phaseId: string;
  direction: "up" | "down";
  disabled: boolean;
  label: string;
  symbol: string;
}) {
  return (
    <form action={movePhaseAction.bind(null, projectId, phaseId, direction)}>
      <Button type="submit" variant="secondary" disabled={disabled} aria-label={label} title={label}>
        {symbol}
      </Button>
    </form>
  );
}

function confirmDeletePhase(e: React.MouseEvent<HTMLButtonElement>) {
  if (!window.confirm("למחוק את השלב? המשימות המשויכות אליו יישארו, אבל בלי שיוך לשלב.")) {
    e.preventDefault();
  }
}
