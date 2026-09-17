import { PageHeader } from "@/components/ui/page-header";
import { ContentFormScreen } from "@/features/admin-content/components/content-form-screen";

export default function NewContentTemplatePage() {
  return (
    <div>
      <PageHeader title="תבנית תוכן חדשה" />
      <ContentFormScreen />
    </div>
  );
}
