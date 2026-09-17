import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { AppError } from "@/lib/errors";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { listTemplates } from "../service";
import { ContentFilterBar, ContentList } from "./content-list";

export async function ContentListScreen({ type, status }: { type?: string; status?: string }) {
  let session;
  try {
    session = await requireAdminSession();
  } catch (error) {
    const message = error instanceof AppError ? error.message : undefined;
    return <ErrorState title="אין הרשאה" description={message} />;
  }

  let templates;
  try {
    templates = await listTemplates(session.userId, { type, status });
  } catch (error) {
    const message = error instanceof AppError ? error.message : undefined;
    return <ErrorState title="לא הצלחנו לטעון תוכן" description={message} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ContentFilterBar type={type} status={status} />
        <Link href="/admin/content/new">
          <Button>תבנית חדשה</Button>
        </Link>
      </div>
      {templates.length === 0 ? (
        <EmptyState
          title="אין עדיין תוכן במערכת - מצב תחזוקה"
          description='לא פורסמה עדיין אף תבנית. אין יצירה אקראית של תוכן - כל תבנית נוצרת כאן במפורש.'
          action={
            <Link href="/admin/content/new">
              <Button>יצירת תבנית ראשונה</Button>
            </Link>
          }
        />
      ) : (
        <ContentList templates={templates} />
      )}
    </div>
  );
}
