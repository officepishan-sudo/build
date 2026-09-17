import { PageHeader } from "@/components/ui/page-header";
import { CreateProjectForm } from "@/features/projects/components/create-project-form";

export default function NewProjectPage({
  searchParams,
}: {
  searchParams: { mode?: string; track?: string };
}) {
  const existing = searchParams.mode === "existing";
  const quotesOnly = searchParams.track === "quotes-only";

  return (
    <div>
      <PageHeader
        title="יצירת פרויקט"
        description={existing ? "נגדיר בסיס, ובשלב הבא נקלוט מה כבר קיים." : "כמה פרטים בסיסיים כדי להתחיל."}
      />
      <CreateProjectForm existing={existing} quotesOnly={quotesOnly} />
    </div>
  );
}
