import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { DocumentsPageContent } from "@/features/documents/components/documents-page-content";

export default async function ProjectDocumentsPage({
  params,
  searchParams,
}: {
  params: { projectId: string };
  searchParams: { category?: string };
}) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader
        title="מרכז מסמכים"
        description="תוכניות, הצעות, חוזים, חשבוניות, אישורים, הזמנות, אחריות ותיעוד - הכל במקום אחד, לפי קטגוריה."
      />
      <DocumentsPageContent userId={session.userId} projectId={params.projectId} category={searchParams.category} />
    </div>
  );
}
