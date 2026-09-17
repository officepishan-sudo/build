"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PhaseForm } from "./phase-form";
import type { PhaseWithTasks } from "../types";

export function AddPhase({ projectId, phases }: { projectId: string; phases: PhaseWithTasks[] }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button type="button" onClick={() => setOpen(true)}>
        + הוספת שלב
      </Button>
    );
  }

  return <PhaseForm projectId={projectId} otherPhases={phases} onDone={() => setOpen(false)} />;
}
