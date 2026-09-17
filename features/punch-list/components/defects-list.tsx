import { Card } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { AppError } from "@/lib/errors";
import { listDefects } from "../service";
import { DefectRow } from "./defect-row";

export async function DefectsList({ userId, projectId }: { userId: string; projectId: string }) {
  let defects: Awaited<ReturnType<typeof listDefects>>;
  try {
    defects = await listDefects(userId, projectId);
  } catch (error) {
    const message = error instanceof AppError ? error.message : undefined;
    return <ErrorState title="לא הצלחנו לטעון את רשימת הליקויים" description={message} />;
  }

  if (defects.length === 0) {
    return (
      <EmptyState
        title="סיום חיובי - אין ליקויים פתוחים"
        description="הפרויקט נראה מוכן. אם יתגלה ליקוי לפני המסירה הסופית, אפשר לדווח עליו כאן."
      />
    );
  }

  return (
    <Card>
      <ul className="divide-y divide-gray-100">
        {defects.map((defect) => (
          <DefectRow key={defect.id} projectId={projectId} defect={defect} />
        ))}
      </ul>
    </Card>
  );
}
