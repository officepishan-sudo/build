import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { EditCartItemForm } from "@/features/cart/components/edit-cart-item-form";
import { NotFoundError } from "@/lib/errors";
import { getCartItemForEdit, listPickerOptions } from "@/features/cart/service";

export default async function EditCartItemPage({
  params,
}: {
  params: { projectId: string; cartItemId: string };
}) {
  const session = await requireSession();
  const { projectId, cartItemId } = params;

  try {
    const [item, picker] = await Promise.all([
      getCartItemForEdit(session.userId, projectId, cartItemId),
      listPickerOptions(session.userId, projectId),
    ]);
    return (
      <div>
        <PageHeader title="שינוי ספק/כמות" description={item.description} />
        <EditCartItemForm projectId={projectId} item={item} suppliers={picker.suppliers} phases={picker.phases} />
      </div>
    );
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }
}
