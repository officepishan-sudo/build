"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import type { SupplierFormState } from "../actions";

type Action = (prevState: SupplierFormState, formData: FormData) => Promise<SupplierFormState>;
type SupplierOption = { id: string; name: string };
// שדות בלבד (בלי import type מ-@prisma/client) - נמנעים מייבוא Prisma ברכיב 'use client'.
// priceMin/priceMax/warrantyMonths/deliveryLeadDays מגיעים כאן כמחרוזת (defaultValue של input),
// הממיר קורה אצל הקורא (product-row.tsx) לפני ההעברה.
type ProductFormValues = {
  name: string;
  category: string;
  priceMin?: string | null;
  priceMax?: string | null;
  unit: string;
  deliveryLeadDays?: string | null;
  availability: string | null;
  warrantyMonths?: string | null;
};

// טופס משותף למוצר - נצרך גם בעריכה/הוספה מתוך פרופיל ספק (supplierOptions לא מועבר,
// ה-action מחייב supplierId) וגם מקטלוג גלובלי P17 (supplierOptions מוצג כ-select).
export function ProductForm({
  action,
  defaultValues,
  submitLabel,
  supplierOptions,
}: {
  action: Action;
  defaultValues?: ProductFormValues;
  submitLabel: string;
  supplierOptions?: SupplierOption[];
}) {
  const [state, formAction] = useFormState(action, null);

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      )}

      {supplierOptions && (
        <div>
          <label htmlFor="supplierId" className="mb-1 block text-sm font-medium text-gray-700">
            ספק
          </label>
          <select id="supplierId" name="supplierId" required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            {supplierOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <TextField label="שם מוצר" name="name" defaultValue={defaultValues?.name} required />
      <TextField label="קטגוריה" name="category" defaultValue={defaultValues?.category} required />

      <div className="grid grid-cols-2 gap-3">
        <TextField label="מחיר מינימלי (₪)" name="priceMin" type="number" defaultValue={defaultValues?.priceMin?.toString()} />
        <TextField label="מחיר מקסימלי (₪)" name="priceMax" type="number" defaultValue={defaultValues?.priceMax?.toString()} />
      </div>

      <TextField label="יחידת מידה" name="unit" defaultValue={defaultValues?.unit} required />

      <div className="grid grid-cols-2 gap-3">
        <TextField label="ימי הובלה" name="deliveryLeadDays" type="number" defaultValue={defaultValues?.deliveryLeadDays?.toString()} />
        <TextField label="חודשי אחריות" name="warrantyMonths" type="number" defaultValue={defaultValues?.warrantyMonths?.toString()} />
      </div>

      <TextField label="זמינות (לא חובה)" name="availability" defaultValue={defaultValues?.availability ?? ""} />

      <SubmitButton label={submitLabel} />
    </form>
  );
}

function TextField({
  label,
  name,
  defaultValue,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
    </div>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "שומר..." : label}
    </Button>
  );
}
