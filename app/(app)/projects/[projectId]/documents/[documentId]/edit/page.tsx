import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { DocumentForm } from "@/features/documents/components/document-form";
import { getDocument } from "@/features/documents/service";

export default async function EditDocumentPage({
  params,
}: {
  params: { projectId: string; documentId: string };
}) {
  const session = await requireSession();
  const document = await getDocument(session.userId, params.projectId, params.documentId);

  if (!document) {
    return <p className="text-gray-500">המסמך לא נמצא.</p>;
  }

  return (
    <div>
      <PageHeader title="עריכת מסמך" description={document.name} />
      <div className="max-w-lg">
        <DocumentForm projectId={params.projectId} document={document} />
      </div>
    </div>
  );
}
