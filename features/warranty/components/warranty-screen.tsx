import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { Button } from "@/components/ui/button";
import { AppError } from "@/lib/errors";
import { getWarrantyFormOptions, listMaintenanceItems, listWarranties } from "../service";
import { CreateWarrantyForm } from "./create-warranty-form";
import { WarrantyRow } from "./warranty-row";
import { CreateMaintenanceForm } from "./create-maintenance-form";
import { MaintenanceRow } from "./maintenance-row";

export async function WarrantyScreen({ userId, projectId }: { userId: string; projectId: string }) {
  let data;
  try {
    const [warranties, maintenanceItems, options] = await Promise.all([
      listWarranties(userId, projectId),
      listMaintenanceItems(userId, projectId),
      getWarrantyFormOptions(userId, projectId),
    ]);
    data = { warranties, maintenanceItems, options };
  } catch (error) {
    const message = error instanceof AppError ? error.message : undefined;
    return <ErrorState title="לא הצלחנו לטעון אחריות ותחזוקה" description={message} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-end gap-4 text-sm">
        <Link href={`/projects/${projectId}/documents`} className="text-brand-700 hover:underline">
          למסמכי הפרויקט (אישורי אחריות וכו') ←
        </Link>
        <Link href="/projects/new">
          <Button variant="secondary">פתיחת פרויקט המשך</Button>
        </Link>
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-gray-700">אחריות לפי פריט וספק</h2>
        <Card>
          {data.warranties.length === 0 ? (
            <EmptyState title="אין עדיין רשומות אחריות" description="אפשר להוסיף אחריות בכל שלב - זה לא חוסם." />
          ) : (
            <ul className="mb-4 divide-y divide-gray-100">
              {data.warranties.map((w) => (
                <WarrantyRow key={w.id} projectId={projectId} warranty={w} />
              ))}
            </ul>
          )}
          <CreateWarrantyForm projectId={projectId} suppliers={data.options.suppliers} professionals={data.options.professionals} />
        </Card>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-gray-700">תזכורות תחזוקה</h2>
        <Card>
          {data.maintenanceItems.length === 0 ? (
            <EmptyState title="אין עדיין תזכורות תחזוקה" description="אפשר להוסיף תזכורת בכל שלב - זה לא חוסם." />
          ) : (
            <ul className="mb-4 divide-y divide-gray-100">
              {data.maintenanceItems.map((item) => (
                <MaintenanceRow key={item.id} projectId={projectId} item={item} />
              ))}
            </ul>
          )}
          <CreateMaintenanceForm projectId={projectId} warranties={data.options.warranties} />
        </Card>
      </section>
    </div>
  );
}
