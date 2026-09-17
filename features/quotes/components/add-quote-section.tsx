import { QuoteForm } from "./quote-form";
import { listProfessionalOptions, listSupplierOptions } from "@/lib/db/directory-lookups";
import { listQuoteRequestOptions } from "../repository";

// "טופס הוספת הצעה שהתקבלה" - אין pipeline קליטה אמיתי, ר' DEC בדוח: הזנה ידנית בלבד.
export async function AddQuoteSection({ projectId }: { projectId: string }) {
  const [professionals, suppliers, quoteRequests] = await Promise.all([
    listProfessionalOptions(),
    listSupplierOptions(),
    listQuoteRequestOptions(projectId),
  ]);

  return (
    <QuoteForm
      projectId={projectId}
      professionals={professionals}
      suppliers={suppliers}
      quoteRequests={quoteRequests.map((qr) => ({ id: qr.id, title: qr.title }))}
    />
  );
}
