"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { sendMessageAction, type MessageFormState } from "../actions";
import { RELATED_TYPE_SUGGESTIONS } from "../constants";

type AttachableDocument = { id: string; name: string; category: string };

const initialState: MessageFormState = null;

export function MessageComposer({
  projectId,
  documents,
}: {
  projectId: string;
  documents: AttachableDocument[];
}) {
  const action = sendMessageAction.bind(null, projectId);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold text-gray-700">הודעה חדשה</h2>
      <form action={formAction} className="space-y-3">
        {state?.error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
        )}
        <textarea
          name="body"
          required
          rows={3}
          placeholder="כתבו הודעה..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            name="relatedType"
            list="related-type-suggestions"
            placeholder="קשר לפריט (למשל: הזמנה)"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            name="relatedId"
            placeholder="מזהה/מספר (לא חובה)"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <datalist id="related-type-suggestions">
          {RELATED_TYPE_SUGGESTIONS.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
        <AttachmentFields documents={documents} />
        <SubmitButton />
      </form>
    </Card>
  );
}

function AttachmentFields({ documents }: { documents: AttachableDocument[] }) {
  return (
    <div className="space-y-2 rounded-md border border-gray-100 bg-gray-50 p-3">
      <p className="text-xs font-medium text-gray-600">צירוף (לא חובה) - מסמך קיים או קישור חדש</p>
      <select name="existingDocumentId" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
        <option value="">— בחרו מסמך קיים —</option>
        {documents.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.name} ({doc.category})
          </option>
        ))}
      </select>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          name="newDocumentName"
          placeholder="או: שם מסמך חדש"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          name="newDocumentUrl"
          placeholder="קישור למסמך החדש"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "שולח..." : "שליחת הודעה"}
    </Button>
  );
}
