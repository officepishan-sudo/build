"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { ProjectShare } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { changeShareLevelAction, removeShareAction, type ShareFormState } from "../actions";
import { ASSIGNABLE_SHARE_LEVELS, SHARE_LEVEL_LABEL } from "../constants";

const initialState: ShareFormState = null;

export function ChangeLevelForm({ projectId, share }: { projectId: string; share: ProjectShare }) {
  const action = changeShareLevelAction.bind(null, projectId, share.id);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <form action={formAction} className="flex items-center gap-2">
        <select name="level" defaultValue={share.level} className="rounded-md border border-gray-300 px-2 py-1 text-sm">
          {ASSIGNABLE_SHARE_LEVELS.map((level) => (
            <option key={level} value={level}>
              {SHARE_LEVEL_LABEL[level]}
            </option>
          ))}
        </select>
        <input
          name="domain"
          defaultValue={share.domain ?? ""}
          placeholder="תחום (ל-ניהול, לא חובה)"
          className="w-32 rounded-md border border-gray-300 px-2 py-1 text-sm"
        />
        <SaveButton />
      </form>
      {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
      <button
        type="button"
        className="text-xs text-red-600 hover:underline"
        onClick={() => {
          if (confirm("לבטל את השיתוף עם המשתמש הזה?")) {
            removeShareAction(projectId, share.id);
          }
        }}
      >
        בטל שיתוף
      </button>
    </div>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="secondary" disabled={pending}>
      {pending ? "שומר..." : "עדכן"}
    </Button>
  );
}
