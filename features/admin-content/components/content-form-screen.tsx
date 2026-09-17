import { ErrorState } from "@/components/ui/states";
import { AppError } from "@/lib/errors";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { getTemplate } from "../service";
import { ContentForm } from "./content-form";

export async function ContentFormScreen({ templateId }: { templateId?: string }) {
  try {
    const session = await requireAdminSession();
    const template = templateId ? await getTemplate(session.userId, templateId) : undefined;
    return <ContentForm template={template} />;
  } catch (error) {
    const message = error instanceof AppError ? error.message : undefined;
    return <ErrorState title="לא ניתן להציג את הטופס" description={message} />;
  }
}
