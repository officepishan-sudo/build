import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getExistingProjectIntake } from "@/features/projects/service";

const ROWS = [
  { key: "requirements", label: "דרישות שנאספו" },
  { key: "quantityItems", label: "שורות כתב כמויות" },
  { key: "quotes", label: "הצעות מחיר" },
  { key: "orders", label: "הזמנות" },
  { key: "documents", label: "מסמכים" },
  { key: "phases", label: "שלבים בלוח זמנים" },
] as const;

export default async function ProjectIntakePage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();
  const project = await getExistingProjectIntake(session.userId, params.projectId);

  if (!project) {
    return <p className="text-gray-500">הפרויקט לא נמצא.</p>;
  }

  return (
    <div>
      <PageHeader
        title={`קליטת המצב הקיים - ${project.name}`}
        description="זה מה שכבר יש לנו על הפרויקט. אפשר להוסיף מסמכים או להזין ידנית מה שחסר - אין חובה להתחיל מחדש."
      />
      <Card className="max-w-xl">
        <ul className="divide-y divide-gray-100">
          {ROWS.map((row) => (
            <li key={row.key} className="flex items-center justify-between py-2 text-sm">
              <span className="text-gray-600">{row.label}</span>
              <span className="font-medium text-gray-900">{project._count[row.key]}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-gray-400">
          מידע חסר יסומן כ&quot;לא ידוע&quot; במקום להיעלם - אפשר להשלים בהמשך בכל שלב.
        </p>
      </Card>
      <div className="mt-6 flex gap-3">
        <Link href={`/projects/${project.id}/documents`}>
          <Button variant="secondary">העלאת מסמכים</Button>
        </Link>
        <Link href={`/projects/${project.id}`}>
          <Button>המשך לדשבורד הפרויקט</Button>
        </Link>
      </div>
    </div>
  );
}
