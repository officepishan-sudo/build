import type { ProfessionalLookup, SupplierLookup } from "@/lib/db/directory-lookups";

export function RecipientChecklist({
  professionals,
  suppliers,
}: {
  professionals: ProfessionalLookup[];
  suppliers: SupplierLookup[];
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-1 text-sm font-medium text-gray-700">נמענים (בעלי מקצוע וספקים)</legend>
      <RecipientGroup title="בעלי מקצוע" name="recipientProfessionalIds" items={professionals} />
      <RecipientGroup title="ספקים" name="recipientSupplierIds" items={suppliers} />
    </fieldset>
  );
}

function RecipientGroup({
  title,
  name,
  items,
}: {
  title: string;
  name: string;
  items: { id: string; name: string; area: string | null }[];
}) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-400">{title}: אין עדיין במאגר.</p>;
  }
  return (
    <div>
      <p className="mb-1 text-sm text-gray-600">{title}</p>
      <div className="flex max-h-40 flex-col gap-1 overflow-y-auto rounded-md border border-gray-200 p-2">
        {items.map((item) => (
          <label key={item.id} className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" name={name} value={item.id} className="h-4 w-4" />
            {item.name} {item.area && <span className="text-gray-400">({item.area})</span>}
          </label>
        ))}
      </div>
    </div>
  );
}
