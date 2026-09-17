import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { ProjectsList } from "@/features/projects/components/projects-list";

export default async function HomePage() {
  const session = await requireSession();

  return (
    <div>
      <PageHeader
        title="הפרויקטים שלי"
        description="כל הפרויקטים במקום אחד - פתחו כדי להמשיך, או התחילו חדש."
        actions={
          <Link href="/onboarding">
            <Button>פרויקט חדש</Button>
          </Link>
        }
      />
      <ProjectsList userId={session.userId} />
    </div>
  );
}
