import { SupplierForm } from "./supplier-form";
import { createSupplierAction } from "../actions";

export function CreateSupplierForm() {
  return <SupplierForm action={createSupplierAction} submitLabel="הוספת ספק" />;
}
