import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { listDocuments } from "../service";
import { DocumentRow } from "./document-row";

export async function DocumentList({
  userId,
  projectId,
  category,
}: {
  userId: string;
  projectId: string;
  category?: string;
}) {
  const documents = await listDocuments(userId, projectId, category);

  if (documents.length === 0) {
    return (
      <EmptyState
        title={category ? `אין מסמכים בקטגוריה "${category}"` : "עדיין אין מסמכים בפרויקט"}
        description="הוסיפו תוכניות, הצעות, חוזים, חשבוניות, אישורים, הזמנות, אחריות או תיעוד כללי - כל מסמך במקום אחד."
      />
    );
  }

  return (
    <Card>
      <ul className="divide-y divide-gray-100">
        {documents.map((doc) => (
          <DocumentRow key={doc.id} projectId={projectId} document={doc} />
        ))}
      </ul>
    </Card>
  );
}
