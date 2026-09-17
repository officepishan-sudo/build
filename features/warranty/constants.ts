import type { WarrantyStatus } from "./warranty-status";

export const WARRANTY_STATUS_LABEL: Record<WarrantyStatus, string> = {
  ACTIVE: "בתוקף",
  EXPIRING_SOON: "עומדת לפוג",
  EXPIRED: "פגה",
};

export const WARRANTY_STATUS_TONE: Record<WarrantyStatus, "success" | "warning" | "danger"> = {
  ACTIVE: "success",
  EXPIRING_SOON: "warning",
  EXPIRED: "danger",
};
