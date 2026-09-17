import type { ReactNode } from "react";

/**
 * מצבי המערכת המחייבים (סעיף 12 במסמך): Empty/Loading/Error/Partial וכו'.
 * כל מסך אמור להשתמש באלה במקום להמציא מצג משלו.
 */

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
      <p className="text-lg font-medium text-gray-700">{title}</p>
      {description && <p className="max-w-md text-sm text-gray-500">{description}</p>}
      {action}
    </div>
  );
}

export function LoadingState({ label = "טוען..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 p-10 text-gray-500" role="status" aria-live="polite">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-brand-600" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorState({
  title = "משהו השתבש",
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-8 text-center">
      <p className="font-medium text-red-800">{title}</p>
      {description && <p className="text-sm text-red-600">{description}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          נסה שוב
        </button>
      )}
    </div>
  );
}

export function PartialBanner({ missing }: { missing: string }) {
  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
      חסר מידע להשלמת התמונה: {missing}. אפשר להמשיך - זה לא חוסם.
    </div>
  );
}

export function ConflictBanner({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-orange-300 bg-orange-50 p-3 text-sm text-orange-900">
      <strong>יש סתירה בין מקורות מידע:</strong> {message} נדרשת הכרעה מפורשת - שום דבר לא נדרס בשקט.
    </div>
  );
}

export function NeedsCheckBadge({ label = "דורש בדיקה" }: { label?: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
      {label}
    </span>
  );
}
