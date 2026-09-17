import Link from "next/link";
import type { Document } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { DeleteDocumentButton } from "./delete-document-button";

export function DocumentRow({ projectId, document }: { projectId: string; document: Document }) {
  return (
    <li className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-gray-900">{document.name}</span>
          <Badge tone="info">{document.category}</Badge>
          {!document.fileUrl && <Badge tone="warning">קובץ חסר</Badge>}
        </div>
        <p className="text-xs text-gray-500">
          הועלה: {formatDate(document.uploadedAt)}
          {(document.relatedType || document.relatedId) && (
            <> · קשור ל: {document.relatedType} {document.relatedId}</>
          )}
        </p>
        {document.notes && <p className="mt-1 text-sm text-gray-600">{document.notes}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-3 text-sm">
        {document.fileUrl && (
          <a
            href={document.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-brand-600 hover:underline"
          >
            פתח
          </a>
        )}
        <Link href={`/projects/${projectId}/documents/${document.id}/edit`} className="text-gray-600 hover:underline">
          ערוך
        </Link>
        <DeleteDocumentButton projectId={projectId} documentId={document.id} />
      </div>
    </li>
  );
}
