import { PageHeader } from "@/components/ui/page-header";
import { ContentListScreen } from "@/features/admin-content/components/content-list-screen";

export default function AdminContentPage({
  searchParams,
}: {
  searchParams: { type?: string; status?: string };
}) {
  return (
    <div>
      <PageHeader
        title="ניהול תוכן ומוצר"
        description="קטגוריות, שאלות, חלופות, מוצרים, תבניות ועזרה - כולם כתבניות תוכן (ContentTemplate) עם טיוטה/פרסום."
      />
      <ContentListScreen type={searchParams.type} status={searchParams.status} />
    </div>
  );
}
