import { EmptyState } from "@/components/ui/states";
import { formatDate } from "@/lib/format";
import { loadCalendarEvents } from "../_lib/calendar-queries";
import type { CalendarEvent, CalendarEventType } from "../_lib/calendar-types";
import { CalendarFilterBar } from "./calendar-filter-bar";
import { CalendarEventRow } from "./calendar-event-row";

export async function CalendarScreen({ projectId, typeFilter }: { projectId: string; typeFilter?: string }) {
  const allEvents = await loadCalendarEvents(projectId);
  const events = typeFilter ? allEvents.filter((e) => e.type === (typeFilter as CalendarEventType)) : allEvents;
  const groups = groupByDate(events);

  return (
    <div className="space-y-4">
      <CalendarFilterBar current={typeFilter} />

      {allEvents.length === 0 && (
        <EmptyState
          title="אין עדיין אירועים בלוח השנה"
          description="ברגע שיהיו משימות עם תאריכים, אספקות, תשלומים או דדליינים להחלטות - הם יופיעו כאן במקום אחד."
        />
      )}

      {allEvents.length > 0 && events.length === 0 && (
        <EmptyState title="אין אירועים מהסוג שנבחר" description="נסו לבחור סוג אחר או לנקות את הסינון." />
      )}

      {groups.length > 0 && (
        <div className="divide-y divide-gray-100 rounded-md border border-gray-200 bg-white">
          {groups.map(([date, dayEvents]) => (
            <div key={date}>
              <p className="bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600">{formatDate(new Date(date))}</p>
              {dayEvents.map((event) => (
                <CalendarEventRow key={`${event.type}-${event.id}`} event={event} />
              ))}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">
        זו תצוגת רשימה כרונולוגית שטוחה (לא לוח גרירה) - היקף מוקטן במכוון להיום. לכן גרירה לתאריך חדש ואישור שינוי
        מהותי אינם רלוונטיים כרגע.
      </p>
    </div>
  );
}

function groupByDate(events: CalendarEvent[]): [string, CalendarEvent[]][] {
  const groups: Record<string, CalendarEvent[]> = {};
  for (const event of events) {
    const key = new Date(event.date).toISOString().slice(0, 10);
    (groups[key] ??= []).push(event);
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}
