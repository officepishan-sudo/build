import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { SelectionConfirm } from "./selection-confirm";
import type { Alternative } from "@prisma/client";
import type { ChangeImpactResult } from "@/lib/change-impact";

type RequirementSnapshotRow = { id?: string; label?: string; value?: string | null };

function sourceRequirements(snapshot: unknown): RequirementSnapshotRow[] {
  if (!Array.isArray(snapshot)) return [];
  return snapshot as RequirementSnapshotRow[];
}

export function AlternativeDetail({
  alternative,
  projectId,
  impact,
}: {
  alternative: Alternative;
  projectId: string;
  impact: ChangeImpactResult | null;
}) {
  const requirements = sourceRequirements(alternative.requirementsSnapshot);

  return (
    <div className="max-w-2xl">
      <Card>
        <p className="text-sm text-gray-600">{alternative.description}</p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-700">
          <span>
            מחיר: {formatCurrency(alternative.priceMin?.toString())} - {formatCurrency(alternative.priceMax?.toString())}
          </span>
          {alternative.durationDays != null && <span>משך משוער: {alternative.durationDays} ימים</span>}
        </div>

        <ProsCons pros={alternative.pros} cons={alternative.cons} />

        {alternative.maintenanceNotes && (
          <Section title="הערות תחזוקה" text={alternative.maintenanceNotes} />
        )}
        {alternative.materialsNotes && <Section title="חומרים" text={alternative.materialsNotes} />}
        {alternative.reasonShown && <Section title="למה אתם רואים את זה" text={alternative.reasonShown} />}

        {requirements.length > 0 && (
          <div className="mt-4">
            <h3 className="mb-1 text-sm font-medium text-gray-700">מקורות דרישה שהובילו לחלופה זו</h3>
            <ul className="list-inside list-disc text-sm text-gray-600">
              {requirements.map((r, i) => (
                <li key={r.id ?? i}>
                  {r.label}
                  {r.value ? `: ${r.value}` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <div className="mt-4 flex gap-3">
        <Link href={`/projects/${projectId}/alternatives/${alternative.id}/play`}>
          <Button variant="secondary">שחק עם התוצאה</Button>
        </Link>
        <Link href={`/projects/${projectId}/alternatives`}>
          <Button variant="ghost">חזרה להשוואה</Button>
        </Link>
      </div>

      <SelectionConfirm
        projectId={projectId}
        alternativeId={alternative.id}
        title={alternative.title}
        isSelected={alternative.isSelected}
        impact={impact}
      />
    </div>
  );
}

function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  if (pros.length === 0 && cons.length === 0) return null;
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <List title="יתרונות" items={pros} />
      <List title="חסרונות" items={cons} />
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="mb-1 text-sm font-medium text-gray-700">{title}</h3>
      <ul className="list-inside list-disc text-sm text-gray-600">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <div className="mt-4">
      <h3 className="mb-1 text-sm font-medium text-gray-700">{title}</h3>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
}
