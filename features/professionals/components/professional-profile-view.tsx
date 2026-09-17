import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import type { Professional, Review } from "@prisma/client";

type ProfileData = Professional & { reviews: Review[]; _count: { quotes: number; tasks: number } };

export function ProfessionalProfileView({ professional }: { professional: ProfileData }) {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap gap-1">
          {professional.fields.map((f) => (
            <Badge key={f}>{f}</Badge>
          ))}
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Field label="אזור" value={professional.area} />
          <Field label="ניסיון" value={professional.experienceYears ? `${professional.experienceYears} שנים` : null} />
          <Field
            label="זמן תגובה ממוצע"
            value={professional.responseTimeHours ? `כ-${professional.responseTimeHours} שעות` : null}
          />
          <Field
            label="דירוג ממוצע (נתון גולמי בלבד)"
            value={professional.ratingAvg ? `${Number(professional.ratingAvg).toFixed(1)} / 5` : null}
          />
        </dl>
        {professional.bio && <p className="mt-4 text-sm text-gray-600">{professional.bio}</p>}
      </Card>

      <Card>
        <h3 className="font-medium text-gray-900">פעילות רלוונטית</h3>
        <p className="mt-2 text-sm text-gray-600">
          {professional._count.quotes} הצעות מחיר ו-{professional._count.tasks} משימות משויכות במערכת.
        </p>
      </Card>

      <ReviewsSection reviews={professional.reviews} />

      <Card>
        <p className="text-sm text-gray-600">
          כדי לבקש הצעת מחיר מבעל המקצוע - יש לעשות זאת מתוך פרויקט ספציפי (בקשת הצעה היא מסך בתוך הפרויקט).
        </p>
        <Link href="/" className="mt-3 inline-block">
          <Button>בחרו פרויקט ובקשו הצעה משם</Button>
        </Link>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value ?? "לא צויין"}</dd>
    </div>
  );
}

function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <Card>
        <p className="text-sm text-gray-500">אין עדיין ביקורות על בעל המקצוע הזה.</p>
      </Card>
    );
  }
  return (
    <Card>
      <h3 className="font-medium text-gray-900">ביקורות ({reviews.length})</h3>
      <ul className="mt-3 divide-y divide-gray-100">
        {reviews.map((r) => (
          <li key={r.id} className="py-3 text-sm first:pt-0">
            <span className="font-medium text-gray-900">{r.rating} / 5</span>
            {r.comment && <p className="mt-1 text-gray-600">{r.comment}</p>}
            <p className="mt-1 text-xs text-gray-400">{formatDate(r.createdAt)}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
