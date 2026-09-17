import Link from "next/link";
import type { Photo, Phase } from "@prisma/client";
import { EmptyState } from "@/components/ui/states";
import { Button } from "@/components/ui/button";
import { listPhotos } from "../service";
import { PhotoCard } from "./photo-card";

type PhotoWithPhase = Photo & { phase: Pick<Phase, "id" | "name"> | null };

export async function PhotoTimeline({ userId, projectId }: { userId: string; projectId: string }) {
  const photos = await listPhotos(userId, projectId);

  if (photos.length === 0) {
    return (
      <EmptyState
        title="עדיין אין תמונות בפרויקט"
        description="הוסיפו תמונה ראשונה - כדאי לתעד כל שלב, במיוחד לפני שמכסים או משנים משהו."
      />
    );
  }

  const groups = groupByPhase(photos);

  return (
    <div className="space-y-8">
      {groups.map(([phaseLabel, phaseId, items]) => (
        <section key={phaseLabel}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">
              {phaseLabel} ({items.length})
            </h2>
            {phaseId && (
              <Link href={`/projects/${projectId}/schedule`}>
                <Button variant="ghost">פתח שלב</Button>
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((photo) => (
              <PhotoCard key={photo.id} projectId={projectId} photo={photo} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function groupByPhase(photos: PhotoWithPhase[]): [string, string | null, PhotoWithPhase[]][] {
  const map = new Map<string, { label: string; phaseId: string | null; items: PhotoWithPhase[] }>();
  for (const photo of photos) {
    const key = photo.phase?.id ?? "none";
    const label = photo.phase?.name ?? "ללא שלב מוגדר";
    if (!map.has(key)) map.set(key, { label, phaseId: photo.phase?.id ?? null, items: [] });
    map.get(key)!.items.push(photo);
  }
  return Array.from(map.values()).map((g) => [g.label, g.phaseId, g.items]);
}
