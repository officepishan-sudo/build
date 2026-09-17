import { ErrorState } from "@/components/ui/states";
import { AppError } from "@/lib/errors";
import { BookSection } from "@/features/project-book/components/book-section";
import { BookSearch } from "@/features/project-book/components/book-search";
import { loadProjectBook } from "../_lib/project-book-queries";
import {
  renderDecision,
  renderDocument,
  renderMaintenanceItem,
  renderOrder,
  renderPayment,
  renderPhoto,
  renderQuantityItem,
  renderQuote,
  renderRegulatoryItem,
  renderWarranty,
} from "./book-item-renderers";

export async function BookScreen({ userId, projectId }: { userId: string; projectId: string }) {
  let book: Awaited<ReturnType<typeof loadProjectBook>>;
  try {
    book = await loadProjectBook(userId, projectId);
  } catch (error) {
    const message = error instanceof AppError ? error.message : undefined;
    return <ErrorState title="לא הצלחנו לטעון את ספר הפרויקט" description={message} />;
  }

  const p = `/projects/${projectId}`;

  return (
    <div className="space-y-6">
      {!book.isFinished && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          הפרויקט עדיין פעיל - זה תקציר ביניים, לא ספר פרויקט סגור.
        </div>
      )}
      <BookSearch>
        <BookSection title="החלטות" {...book.decisions} seeAllHref={`${p}/decisions`} emptyDescription="עדיין לא נפתחו החלטות." renderItem={renderDecision} />
        <BookSection title="כתב כמויות סופי" {...book.quantityItems} seeAllHref={`${p}/quantities`} emptyDescription="עדיין אין שורות בכתב הכמויות." renderItem={renderQuantityItem} />
        <BookSection title="הצעות מחיר" {...book.quotes} seeAllHref={`${p}/quotes`} emptyDescription="עדיין לא התקבלו הצעות מחיר." renderItem={renderQuote} />
        <BookSection title="הזמנות" {...book.orders} seeAllHref={`${p}/orders`} emptyDescription="עדיין לא בוצעו הזמנות." renderItem={renderOrder} />
        <BookSection title="מסמכים" {...book.documents} seeAllHref={`${p}/documents`} emptyDescription="עדיין לא הועלו מסמכים." renderItem={renderDocument} />
        <BookSection title="תמונות" {...book.photos} seeAllHref={`${p}/photos`} emptyDescription="עדיין לא הועלו תמונות." renderItem={renderPhoto} />
        <BookSection title="תשלומים" {...book.payments} seeAllHref={`${p}/payments`} emptyDescription="עדיין לא נרשמו תשלומים." renderItem={renderPayment} />
        <BookSection title="אחריות" {...book.warranties} seeAllHref={`${p}/warranty`} emptyDescription="עדיין אין רשומות אחריות." renderItem={renderWarranty} />
        <BookSection title="תזכורות תחזוקה" {...book.maintenanceItems} seeAllHref={`${p}/warranty`} emptyDescription="עדיין אין תזכורות תחזוקה." renderItem={renderMaintenanceItem} />
        <BookSection title="רשימת בדיקה רגולטורית" {...book.regulatoryItems} seeAllHref={`${p}/regulatory`} emptyDescription="עדיין אין רשימת בדיקה." renderItem={renderRegulatoryItem} />
      </BookSearch>
    </div>
  );
}
