import { DocumentList } from "./document-list";
import { DocumentForm } from "./document-form";
import { CategoryFilter } from "./category-filter";

export function DocumentsPageContent({
  userId,
  projectId,
  category,
}: {
  userId: string;
  projectId: string;
  category?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <CategoryFilter projectId={projectId} active={category} />
        <DocumentList userId={userId} projectId={projectId} category={category} />
      </div>
      <div>
        <DocumentForm projectId={projectId} />
      </div>
    </div>
  );
}
