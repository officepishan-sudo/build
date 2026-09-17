"use client";

import { useTransition } from "react";
import { Button } from "./button";

/**
 * כפתור לפעולת שרת שמרגישה כמו החלטה מכוונת - אם יש confirmMessage, מציג דיאלוג
 * אישור לפני ההרצה. משמש למעברי סטטוס רגישים (הזמנה מאושרת, אספקה שהתקבלה וכו').
 */
export function ConfirmSubmitButton({
  label,
  pendingLabel,
  confirmMessage,
  onRun,
  variant = "secondary",
}: {
  label: string;
  pendingLabel?: string;
  confirmMessage?: string;
  onRun: () => Promise<unknown>;
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (confirmMessage && !window.confirm(confirmMessage)) return;
    startTransition(() => {
      onRun();
    });
  }

  return (
    <Button type="button" variant={variant} onClick={handleClick} disabled={pending}>
      {pending ? (pendingLabel ?? "מעדכן...") : label}
    </Button>
  );
}
