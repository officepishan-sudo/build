import Link from "next/link";
import { ErrorState, EmptyState } from "@/components/ui/states";
import { AppError } from "@/lib/errors";
import { listRooms } from "../service";
import { CreateRoomForm } from "./create-room-form";
import { RoomCard } from "./room-card";

export async function InteriorScreen({ userId, projectId }: { userId: string; projectId: string }) {
  let rooms: Awaited<ReturnType<typeof listRooms>>;
  try {
    rooms = await listRooms(userId, projectId);
  } catch (error) {
    const message = error instanceof AppError ? error.message : undefined;
    return <ErrorState title="לא הצלחנו לטעון את תכנון הפנים" description={message} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-end gap-4 text-sm">
        <Link href="/suppliers" className="text-brand-700 hover:underline">
          לחיפוש מוצרים וספקים ←
        </Link>
        <Link href={`/projects/${projectId}/change-impact`} className="text-brand-700 hover:underline">
          בדיקת השפעת שינוי ←
        </Link>
      </div>
      <CreateRoomForm projectId={projectId} />
      {rooms.length === 0 ? (
        <EmptyState
          title="עדיין אין חדרים בפרויקט הזה"
          description="הסעיף הזה אופציונלי - רלוונטי לפרויקטים עם תכנון פנים. הוסיפו חדר ראשון כדי להתחיל, או דלגו אם זה לא נוגע לפרויקט שלכם."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {rooms.map((room) => (
            <RoomCard key={room.id} projectId={projectId} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}
