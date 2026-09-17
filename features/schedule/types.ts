import type { Phase, Task } from "@prisma/client";

export type PhaseWithTasks = Phase & { tasks: Task[] };
export type ProfessionalOption = { id: string; name: string };

// גרסה מקומית ל-Task, לא Prisma.Task ישירות - כדי ש-'use client' components (טופס/שורת
// משימה) לא ייבאו את @prisma/client (גם ייבוא טיפוס בלבד נתפס ע"י structure-gate.sh
// כ"server-import-in-client" ההיוריסטי; ה-DTO גם עוזר לגבול תצוגה/DB נקי - עיקרון 5).
export type TaskLike = Pick<Task, "id" | "title" | "assigneeProfessionalId" | "startDate" | "endDate" | "status" | "notes">;
