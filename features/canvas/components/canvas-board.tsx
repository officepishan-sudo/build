"use client";

import { useState } from "react";
import type { CanvasElement } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { PinForm } from "./pin-form";

type PendingState = { kind: "new"; x: number; y: number } | { kind: "edit"; pin: CanvasElement } | null;

/** לוח חזותי: תמונת בסיס + פינים ממוקמים באחוזים. קליק על התמונה = פין חדש, קליק על פין = עריכה. */
export function CanvasBoard({
  projectId,
  imageUrl,
  pins,
  requirements,
}: {
  projectId: string;
  imageUrl: string;
  pins: CanvasElement[];
  requirements: { id: string; label: string }[];
}) {
  const [zoom, setZoom] = useState(1);
  const [pending, setPending] = useState<PendingState>(null);

  function handleImageClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10;
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10;
    setPending({ kind: "new", x, y });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button type="button" variant="secondary" onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}>
          הקטן
        </Button>
        <span className="text-sm text-gray-500">זום: {Math.round(zoom * 100)}%</span>
        <Button type="button" variant="secondary" onClick={() => setZoom((z) => Math.min(2, z + 0.25))}>
          הגדל
        </Button>
      </div>
      <div className="overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-2">
        <div
          className="relative inline-block cursor-crosshair"
          style={{ transform: `scale(${zoom})`, transformOrigin: "top right" }}
          onClick={handleImageClick}
        >
          {/* כתובת URL חיצונית חופשית (DEC: אין העלאת קבצים) - לא נכס מקומי של next/image */}
          <img src={imageUrl} alt="תוכנית הפרויקט" className="block max-w-full select-none" draggable={false} />
          {pins.map((pin) => (
            <PinMarker key={pin.id} pin={pin} onClick={() => setPending({ kind: "edit", pin })} />
          ))}
        </div>
      </div>
      {pending && (
        <div className="max-w-sm">
          <PinForm
            projectId={projectId}
            requirements={requirements}
            pin={pending.kind === "edit" ? pending.pin : undefined}
            coords={pending.kind === "new" ? { x: pending.x, y: pending.y } : undefined}
            onDone={() => setPending(null)}
          />
        </div>
      )}
    </div>
  );
}

function PinMarker({ pin, onClick }: { pin: CanvasElement; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={pin.label ?? undefined}
      className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-brand-600 text-xs font-bold text-white shadow"
      style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
    >
      {pin.linkedRequirementId ? "🔗" : "📍"}
    </button>
  );
}
