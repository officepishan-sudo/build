import Link from "next/link";
import { ErrorState } from "@/components/ui/states";
import { AppError } from "@/lib/errors";
import { getCanvasState } from "../service";
import { BaseImageForm } from "./base-image-form";
import { CanvasBoard } from "./canvas-board";
import { PinList } from "./pin-list";

export async function CanvasScreen({ userId, projectId }: { userId: string; projectId: string }) {
  let state: Awaited<ReturnType<typeof getCanvasState>>;
  try {
    state = await getCanvasState(userId, projectId);
  } catch (error) {
    const message = error instanceof AppError ? error.message : undefined;
    return <ErrorState title="לא הצלחנו לטעון את הקנבס" description={message} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href={`/projects/${projectId}/change-impact`} className="text-sm text-brand-700 hover:underline">
          שינוי משמעותי בתכנון? בדקו את השפעת השינוי ←
        </Link>
      </div>
      <BaseImageForm projectId={projectId} currentUrl={state.imageUrl} />
      {state.imageUrl ? (
        <CanvasBoard projectId={projectId} imageUrl={state.imageUrl} pins={state.pins} requirements={state.requirements} />
      ) : (
        <p className="text-sm text-gray-500">
          עדיין אין תוכנית/שרטוט לפרויקט הזה - אפשר להוסיף כתובת תמונה למעלה, או פשוט לנהל פינים כרשימה למטה בלי תצוגה חזותית.
        </p>
      )}
      <PinList projectId={projectId} pins={state.pins} requirements={state.requirements} />
    </div>
  );
}
