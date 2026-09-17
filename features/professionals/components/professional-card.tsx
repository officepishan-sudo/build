import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Professional } from "@prisma/client";

export function ProfessionalCard({ professional }: { professional: Professional }) {
  return (
    <Link href={`/professionals/${professional.id}`}>
      <Card className="h-full transition hover:border-brand-400 hover:shadow-md">
        <h3 className="font-semibold text-gray-900">{professional.name}</h3>
        <div className="mt-1 flex flex-wrap gap-1">
          {professional.fields.map((f) => (
            <Badge key={f}>{f}</Badge>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-500">אזור: {professional.area}</p>
        <p className="mt-1 text-sm text-gray-500">
          ניסיון: {professional.experienceYears ? `${professional.experienceYears} שנים` : "לא צויין"}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          זמן תגובה: {professional.responseTimeHours ? `כ-${professional.responseTimeHours} שעות` : "לא צויין"}
        </p>
        {professional.ratingAvg && (
          <p className="mt-1 text-sm text-gray-500">דירוג ממוצע: {Number(professional.ratingAvg).toFixed(1)} / 5</p>
        )}
      </Card>
    </Link>
  );
}
