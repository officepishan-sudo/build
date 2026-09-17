import { EmptyState, ErrorState } from "@/components/ui/states";
import { Button } from "@/components/ui/button";
import { AppError } from "@/lib/errors";
import { getChecklistState } from "../service";
import { seedChecklistAction } from "../actions";
import { ChecklistItemRow } from "./checklist-item-row";

export async function RegulatoryScreen({ userId, projectId }: { userId: string; projectId: string }) {
  let state: Awaited<ReturnType<typeof getChecklistState>>;
  try {
    state = await getChecklistState(userId, projectId);
  } catch (error) {
    const message = error instanceof AppError ? error.message : undefined;
    return <ErrorState title="לא הצלחנו לטעון את רשימת הבדיקה" description={message} />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <strong>רשימת הבדיקה הזו אינה ייעוץ משפטי או הנדסי.</strong> היא כלי עזר בלבד - סעיף שמסומן &quot;לא יודע&quot;
        בהערות נשאר פתוח לבדיקה, ואף פעם לא הופך אוטומטית ל&quot;לא נדרש&quot;.
      </div>
      {state.items.length === 0 ? (
        <EmptyState
          title={state.canSeed ? "יש תבנית בדיקה זמינה לסוג הפרויקט" : "אין עדיין רשימת בדיקה לסוג הפרויקט הזה"}
          description={
            state.canSeed
              ? "אפשר ליצור רשימת בדיקה ראשונית מהתבניות שהוגדרו במערכת עבור סוג הפרויקט."
              : "מנהל התוכן עדיין לא הגדיר תבניות בדיקה מתאימות - זה לא אומר שאין דרישות רגולטוריות, רק שאין עדיין תבנית זמינה במערכת."
          }
          action={
            state.canSeed && (
              <form action={seedChecklistAction.bind(null, projectId)}>
                <Button type="submit">יצירת רשימת בדיקה</Button>
              </form>
            )
          }
        />
      ) : (
        <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
          {state.items.map((item) => (
            <ChecklistItemRow key={item.id} projectId={projectId} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
}
