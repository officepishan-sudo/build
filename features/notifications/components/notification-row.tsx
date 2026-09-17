"use client";

import { useState, useTransition } from "react";
import type { Notification } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format";
import { markReadAction, openNotificationAction } from "../actions";
import { NOTIFICATION_TYPE_LABEL, NOTIFICATION_TYPE_TONE, resolveNotificationHref } from "../constants";

export function NotificationRow({ notification }: { notification: Notification }) {
  const [dismissed, setDismissed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const href = resolveNotificationHref(notification);

  if (dismissed) return null;

  return (
    <li className={`space-y-2 rounded-lg border p-4 ${notification.isRead ? "border-gray-100 bg-white" : "border-brand-200 bg-brand-50/40"}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {!notification.isRead && <span className="h-2 w-2 rounded-full bg-brand-600" aria-hidden />}
          <span className="font-medium text-gray-900">{notification.title}</span>
        </div>
        <Badge tone={NOTIFICATION_TYPE_TONE[notification.type]}>{NOTIFICATION_TYPE_LABEL[notification.type]}</Badge>
      </div>
      <p className="text-sm text-gray-600">{notification.body}</p>
      <p className="text-xs text-gray-400">{formatDateTime(notification.createdAt)}</p>
      <div className="flex flex-wrap gap-3 text-xs">
        {href && (
          <button
            type="button"
            disabled={isPending}
            className="text-brand-600 hover:underline"
            onClick={() => startTransition(() => openNotificationAction(notification.id, href))}
          >
            פתח
          </button>
        )}
        {!notification.isRead && (
          <button
            type="button"
            disabled={isPending}
            className="text-gray-600 hover:underline"
            onClick={() => startTransition(() => markReadAction(notification.id))}
          >
            סמן כנקרא
          </button>
        )}
        <button type="button" className="text-gray-400 hover:underline" onClick={() => setDismissed(true)}>
          מאוחר יותר
        </button>
      </div>
    </li>
  );
}
