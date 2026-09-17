import type { InteriorItem, Room } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { RoomHeader } from "./room-header";
import { ItemForm } from "./item-form";
import { ItemRow } from "./item-row";

type RoomWithItems = Room & { items: InteriorItem[] };

export function RoomCard({ projectId, room }: { projectId: string; room: RoomWithItems }) {
  return (
    <Card>
      <RoomHeader projectId={projectId} room={room} />
      <div className="mt-3 border-t border-gray-100 pt-3">
        {room.items.length === 0 ? (
          <EmptyState title="אין עדיין פריטים בחדר הזה" description="חדר בלי פריטים תקין - אפשר להוסיף בהמשך." />
        ) : (
          <ul className="mb-3 divide-y divide-gray-100">
            {room.items.map((item) => (
              <ItemRow key={item.id} projectId={projectId} roomId={room.id} item={item} />
            ))}
          </ul>
        )}
        <details>
          <summary className="cursor-pointer text-sm font-medium text-brand-700">הוספת פריט לחדר</summary>
          <div className="mt-2">
            <ItemForm projectId={projectId} roomId={room.id} />
          </div>
        </details>
      </div>
    </Card>
  );
}
