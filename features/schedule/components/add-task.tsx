"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TaskForm } from "./task-form";
import type { ProfessionalOption } from "../types";

export function AddTask({ projectId, phaseId, professionals }: { projectId: string; phaseId: string; professionals: ProfessionalOption[] }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button type="button" variant="ghost" onClick={() => setOpen(true)}>
        + הוספת משימה
      </Button>
    );
  }

  return <TaskForm projectId={projectId} phaseId={phaseId} professionals={professionals} onDone={() => setOpen(false)} />;
}
