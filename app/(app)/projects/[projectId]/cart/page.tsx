import Link from "next/link";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { CartItemsTable } from "@/features/cart/components/cart-items-table";
import { AddCartItemForm } from "@/features/cart/components/add-cart-item-form";
import { addProductToCart, listCart, listPickerOptions } from "@/features/cart/service";
import { CreateOrderForm } from "@/features/orders/components/create-order-form";

export default async function CartPage({
  params,
  searchParams,
}: {
  params: { projectId: string };
  searchParams: { addProductId?: string; supplierId?: string };
}) {
  const session = await requireSession();
  const { projectId } = params;

  if (searchParams.addProductId) {
    await addProductToCart(session.userId, projectId, searchParams.addProductId, searchParams.supplierId);
    redirect(`/projects/${projectId}/cart`);
  }

  const [items, picker] = await Promise.all([
    listCart(session.userId, projectId),
    listPickerOptions(session.userId, projectId),
  ]);

  return (
    <div>
      <PageHeader title="עגלת הפרויקט" description="פריטים שנאספו לפני יצירת הזמנות - אפשר לשנות, לפצל ולהזמין." />

      <Card className="mb-4">
        <h2 className="mb-3 text-sm font-medium text-gray-700">הוספת פריט ידנית</h2>
        <AddCartItemForm projectId={projectId} suppliers={picker.suppliers} phases={picker.phases} />
      </Card>

      {items.length === 0 ? (
        <EmptyState
          title="העגלה ריקה"
          description="אפשר להוסיף פריטים מכתב הכמויות או מקטלוג הספקים."
          action={
            <div className="flex gap-3">
              <Link href={`/projects/${projectId}/quantities`} className="text-brand-600 hover:underline">
                כתב כמויות
              </Link>
              <Link href="/suppliers" className="text-brand-600 hover:underline">
                ספקים
              </Link>
            </div>
          }
        />
      ) : (
        <Card>
          <CreateOrderForm projectId={projectId}>
            <CartItemsTable projectId={projectId} items={items} />
          </CreateOrderForm>
        </Card>
      )}
    </div>
  );
}
