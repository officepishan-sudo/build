"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";

type PhotoWithPhase = {
  id: string;
  url: string;
  takenAt: Date;
  caption: string | null;
  isBeforeAfter: boolean;
  phase: { id: string; name: string } | null;
};

export function PhotoCard({ projectId, photo }: { projectId: string; photo: PhotoWithPhase }) {
  const [broken, setBroken] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex aspect-video items-center justify-center bg-gray-100">
        {broken ? (
          <span className="p-4 text-center text-xs text-gray-400">לא ניתן לטעון את התמונה מהקישור שנשמר</span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- קישור חיצוני שהמשתמש הדביק, לא asset מקומי
          <img
            src={photo.url}
            alt={photo.caption ?? "תמונת פרויקט"}
            className="h-full w-full object-cover"
            onError={() => setBroken(true)}
          />
        )}
      </div>
      <div className="space-y-1 p-3 text-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-gray-500">{formatDate(photo.takenAt)}</span>
          {photo.isBeforeAfter && <Badge tone="info">לפני/אחרי</Badge>}
        </div>
        {photo.caption && <p className="text-gray-700">{photo.caption}</p>}
        <div className="flex items-center justify-between pt-1 text-xs">
          <Link href={`/projects/${projectId}/photos/${photo.id}/edit`} className="text-brand-600 hover:underline">
            ערוך
          </Link>
        </div>
      </div>
    </div>
  );
}
