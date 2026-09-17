import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { WARRANTY_STATUS_LABEL, WARRANTY_STATUS_TONE } from "@/features/warranty/constants";
import type { ProjectBookData } from "../_lib/project-book-queries";

// פונקציית renderItem קטנה לכל דומיין ב-BookSection - קובץ נפרד מ-book-screen.tsx
// כדי לא לנפח רכיב אחד עם 10 בלוקי JSX (עיקרון 2 - קובץ = אחריות אחת).

export function renderDecision(item: ProjectBookData["decisions"]["items"][number]) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span>{item.title}</span>
      <span className="text-xs text-gray-500">
        {item.status} {item.deadline && `· יעד: ${formatDate(item.deadline)}`}
      </span>
    </div>
  );
}

export function renderQuantityItem(item: ProjectBookData["quantityItems"]["items"][number]) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span>
        {item.category} - {item.description}
      </span>
      <span className="text-xs text-gray-500">{formatCurrency(item.totalCost)}</span>
    </div>
  );
}

export function renderQuote(item: ProjectBookData["quotes"]["items"][number]) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span>{item.partyName ?? "ספק/בעל מקצוע לא ידוע"}</span>
      <span className="text-xs text-gray-500">
        {formatCurrency(item.price)} · {item.status}
      </span>
    </div>
  );
}

export function renderOrder(item: ProjectBookData["orders"]["items"][number]) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span>הזמנה {item.number}</span>
      <span className="text-xs text-gray-500">
        {formatCurrency(item.totalAmount)} · {item.status}
      </span>
    </div>
  );
}

export function renderDocument(item: ProjectBookData["documents"]["items"][number]) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span>{item.name}</span>
      <span className="text-xs text-gray-500">{item.category}</span>
    </div>
  );
}

export function renderPhoto(item: ProjectBookData["photos"]["items"][number]) {
  return <span>{item.caption ?? "תמונה בלי כיתוב"}</span>;
}

export function renderPayment(item: ProjectBookData["payments"]["items"][number]) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span>{item.payeeName}</span>
      <span className="text-xs text-gray-500">
        {formatCurrency(item.amount)} · {item.status}
      </span>
    </div>
  );
}

export function renderWarranty(item: ProjectBookData["warranties"]["items"][number]) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span>{item.itemDescription}</span>
      <span className="flex items-center gap-2 text-xs text-gray-500">
        תוקף עד {formatDate(item.expiryDate)}
        <Badge tone={WARRANTY_STATUS_TONE[item.status]}>{WARRANTY_STATUS_LABEL[item.status]}</Badge>
      </span>
    </div>
  );
}

export function renderMaintenanceItem(item: ProjectBookData["maintenanceItems"]["items"][number]) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span>{item.title}</span>
      <span className="text-xs text-gray-500">{item.nextDueDate ? `יעד הבא: ${formatDate(item.nextDueDate)}` : "בלי תאריך קבוע"}</span>
    </div>
  );
}

export function renderRegulatoryItem(item: ProjectBookData["regulatoryItems"]["items"][number]) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span>{item.title}</span>
      <Badge tone={item.isChecked ? "success" : "neutral"}>{item.isChecked ? "סומן" : "טרם נבדק"}</Badge>
    </div>
  );
}
