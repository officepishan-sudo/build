import { PageHeader } from "@/components/ui/page-header";
import { ContentFormScreen } from "@/features/admin-content/components/content-form-screen";

export default function EditContentTemplatePage({ params }: { params: { templateId: string } }) {
  return (
    <div>
      <PageHeader title="עריכת תבנית תוכן" />
      <ContentFormScreen templateId={params.templateId} />
    </div>
  );
}
