"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QuantityItemForm } from "./quantity-item-form";
import type { PhaseOption } from "../types";

export function AddQuantityItem({ projectId, phases, categories }: { projectId: string; phases: PhaseOption[]; categories: string[] }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
        + הוספת שורה
      </Button>
    );
  }

  return <QuantityItemForm projectId={projectId} phases={phases} categories={categories} onDone={() => setOpen(false)} />;
}
