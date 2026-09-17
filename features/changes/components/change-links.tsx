import Link from "next/link";
import { Button } from "@/components/ui/button";

// קישורים בלבד למסכים של סוכנים אחרים - לא בונים כאן לוגיקה של בדיקת השפעה
// או בקשת הצעת מחיר.
export function ChangeLinks({ projectId, changeRequestId }: { projectId: string; changeRequestId: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link href={`/projects/${projectId}/change-impact?changeRequestId=${changeRequestId}`}>
        <Button type="button" variant="secondary">
          בדוק השפעה
        </Button>
      </Link>
      <Link href={`/projects/${projectId}/quote-requests/new?changeRequestId=${changeRequestId}`}>
        <Button type="button" variant="secondary">
          בקשת הצעת מחיר
        </Button>
      </Link>
    </div>
  );
}
