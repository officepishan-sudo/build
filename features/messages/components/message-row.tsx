import Link from "next/link";
import { formatDateTime } from "@/lib/format";

type MessageWithRelations = {
  id: string;
  body: string;
  relatedType: string | null;
  relatedId: string | null;
  createdAt: Date;
  author: { name: string };
  attachments: { id: string; name: string }[];
};

export function MessageRow({ projectId, message }: { projectId: string; message: MessageWithRelations }) {
  const encodedTitle = encodeURIComponent(message.body.slice(0, 80));

  return (
    <li className="space-y-2 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-gray-900">{message.author.name}</span>
        <span className="text-xs text-gray-400">{formatDateTime(message.createdAt)}</span>
      </div>
      <p className="whitespace-pre-wrap text-sm text-gray-700">{message.body}</p>
      {(message.relatedType || message.relatedId) && (
        <p className="text-xs text-gray-500">
          קשור ל: {message.relatedType} {message.relatedId}
        </p>
      )}
      {message.attachments.length > 0 && (
        <ul className="flex flex-wrap gap-2 text-xs text-brand-700">
          {message.attachments.map((doc) => (
            <li key={doc.id} className="rounded-md bg-brand-50 px-2 py-1">
              📎 {doc.name}
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-3 text-xs">
        <Link
          href={`/projects/${projectId}/issues?fromMessageId=${message.id}&title=${encodedTitle}`}
          className="text-brand-600 hover:underline"
        >
          הפוך ל-Issue
        </Link>
        <Link
          href={`/projects/${projectId}/schedule?fromMessageId=${message.id}&title=${encodedTitle}`}
          className="text-brand-600 hover:underline"
        >
          הפוך למשימה
        </Link>
      </div>
    </li>
  );
}
