"use client";

import { deleteDocumentAction } from "../actions";

export function DeleteDocumentButton({ projectId, documentId }: { projectId: string; documentId: string }) {
  return (
    <button
      type="button"
      className="text-red-600 hover:underline"
      onClick={() => {
        if (confirm("למחוק את המסמך? לא ניתן לשחזר.")) {
          deleteDocumentAction(projectId, documentId);
        }
      }}
    >
      מחק
    </button>
  );
}
