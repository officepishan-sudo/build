import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { EVENT_TYPE_LABEL, type CalendarEvent, type CalendarEventType } from "../_lib/calendar-types";

const TONE_BY_TYPE: Record<CalendarEventType, "info" | "success" | "warning" | "neutral"> = {
  task: "info",
  delivery: "success",
  payment: "warning",
  decision: "neutral",
};

export function CalendarEventRow({ event }: { event: CalendarEvent }) {
  return (
    <Link
      href={event.href}
      className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-3 py-2 text-sm last:border-0 hover:bg-gray-50"
    >
      <span className="flex items-center gap-2">
        <Badge tone={TONE_BY_TYPE[event.type]}>{EVENT_TYPE_LABEL[event.type]}</Badge>
        <span className="font-medium text-gray-800">{event.title}</span>
      </span>
      {event.subtitle && <span className="text-xs text-gray-500">{event.subtitle}</span>}
    </Link>
  );
}
