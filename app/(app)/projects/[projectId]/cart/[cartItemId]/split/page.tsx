import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { SplitCartItemForm } from "@/features/cart/components/split-cart-item-form";
import { NotFoundError } from "@/lib/errors";
import { getCartItemForEdit } from "@/features/cart/service";

export default async function SplitCartItemPage({
  params,
}: {
  params: { projectId: string; cartItemId: string };
}) {
  const session = await requireSession();
  const { projectId, cartItemId } = params;

  try {
    const item = await getCartItemForEdit(session.userId, projectId, cartItemId);
    return (
      <div>
        <PageHeader title="פיצול שורת עגלה" description={item.description} />
        <SplitCartItemForm projectId={projectId} item={item} />
      </div>
    );
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }
}
