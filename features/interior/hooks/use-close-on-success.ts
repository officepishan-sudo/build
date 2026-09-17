import { useEffect } from "react";

/** סוגר טופס (עורך/מוסיף) אוטומטית ברגע ש-useFormState מחזיר ok - נמנע משכפול ב-3 טפסים. */
export function useCloseOnSuccess(state: { ok?: boolean } | null, onDone?: () => void) {
  useEffect(() => {
    if (state?.ok) onDone?.();
  }, [state, onDone]);
}
