import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import type { Alternative } from "@prisma/client";

export function AlternativeCard({ alternative, projectId }: { alternative: Alternative; projectId: string }) {
  return (
    <Link href={`/projects/${projectId}/alternatives/${alternative.id}`}>
      <Card className="h-full transition hover:border-brand-400 hover:shadow-md">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900">{alternative.title}</h3>
          {alternative.isSelected && <Badge tone="success">נבחרה</Badge>}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">{alternative.description}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
          <span>
            מחיר: {formatCurrency(alternative.priceMin?.toString())} - {formatCurrency(alternative.priceMax?.toString())}
          </span>
          {alternative.durationDays != null && <span>משך: {alternative.durationDays} ימים</span>}
        </div>
        {alternative.imageUrl && (
          // תמונה כקישור טקסט בלבד (DEC: אין backend להעלאת קבצים) - מוצגת אם קיים URL תקין.
          <img src={alternative.imageUrl} alt={alternative.title} className="mt-3 h-32 w-full rounded-md object-cover" />
        )}
      </Card>
    </Link>
  );
}
