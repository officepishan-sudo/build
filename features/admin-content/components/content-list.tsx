import Link from "next/link";
import type { ContentTemplate } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format";
import { publishTemplateAction, unpublishTemplateAction, deleteTemplateAction } from "../actions";
import { TEMPLATE_STATUS_LABEL, TEMPLATE_TYPE_LABEL, TEMPLATE_STATUS_VALUES, TEMPLATE_TYPE_VALUES } from "../constants";

export function ContentFilterBar({ type, status }: { type?: string; status?: string }) {
  return (
    <form method="get" className="flex flex-wrap items-end gap-3 text-sm">
      <label>
        סוג
        <select name="type" defaultValue={type ?? ""} className="mt-1 block rounded-md border border-gray-300 px-2 py-1.5">
          <option value="">הכל</option>
          {TEMPLATE_TYPE_VALUES.map((t) => (
            <option key={t} value={t}>
              {TEMPLATE_TYPE_LABEL[t]}
            </option>
          ))}
        </select>
      </label>
      <label>
        סטטוס
        <select name="status" defaultValue={status ?? ""} className="mt-1 block rounded-md border border-gray-300 px-2 py-1.5">
          <option value="">הכל</option>
          {TEMPLATE_STATUS_VALUES.map((s) => (
            <option key={s} value={s}>
              {TEMPLATE_STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-50">
        סינון
      </button>
    </form>
  );
}

export function ContentList({ templates }: { templates: ContentTemplate[] }) {
  return (
    <table className="w-full text-right text-sm">
      <thead>
        <tr className="border-b border-gray-200 text-xs text-gray-500">
          <th className="px-2 py-2">סוג</th>
          <th className="px-2 py-2">מפתח</th>
          <th className="px-2 py-2">סטטוס</th>
          <th className="px-2 py-2">עודכן</th>
          <th className="px-2 py-2" />
        </tr>
      </thead>
      <tbody>
        {templates.map((t) => (
          <ContentListRow key={t.id} template={t} />
        ))}
      </tbody>
    </table>
  );
}

function ContentListRow({ template }: { template: ContentTemplate }) {
  const toggleAction = template.status === "PUBLISHED" ? unpublishTemplateAction : publishTemplateAction;
  return (
    <tr className="border-b border-gray-100">
      <td className="px-2 py-2">{TEMPLATE_TYPE_LABEL[template.type]}</td>
      <td className="px-2 py-2">
        <Link href={`/admin/content/${template.id}`} className="text-brand-700 hover:underline">
          {template.key}
        </Link>
      </td>
      <td className="px-2 py-2">
        <Badge tone={template.status === "PUBLISHED" ? "success" : "neutral"}>
          {TEMPLATE_STATUS_LABEL[template.status]}
        </Badge>
      </td>
      <td className="px-2 py-2 text-gray-500">{formatDateTime(template.updatedAt)}</td>
      <td className="px-2 py-2">
        <div className="flex justify-end gap-3 text-xs">
          <form action={toggleAction.bind(null, template.id)}>
            <button type="submit" className="text-brand-700 hover:underline">
              {template.status === "PUBLISHED" ? "הסרת פרסום" : "פרסום"}
            </button>
          </form>
          <form action={deleteTemplateAction.bind(null, template.id)}>
            <button type="submit" className="text-red-600 hover:underline">
              מחיקה
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}
