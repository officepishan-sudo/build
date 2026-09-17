import { z } from "zod";

const PHASE_STATUS_VALUES = ["NOT_STARTED", "IN_PROGRESS", "DONE", "DELAYED"] as const;
const TASK_STATUS_VALUES = ["NOT_STARTED", "IN_PROGRESS", "DONE", "DELAYED"] as const;

export const phaseSchema = z
  .object({
    name: z.string().min(1, "יש להזין שם לשלב"),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    status: z.enum(PHASE_STATUS_VALUES).default("NOT_STARTED"),
    dependsOnPhaseId: z.string().optional(),
  })
  .refine((data) => !data.startDate || !data.endDate || data.endDate >= data.startDate, {
    message: "תאריך הסיום לא יכול להיות לפני תאריך ההתחלה",
    path: ["endDate"],
  });

export type PhaseInput = z.infer<typeof phaseSchema>;

export const taskSchema = z
  .object({
    title: z.string().min(1, "יש להזין כותרת למשימה"),
    // בעל מקצוע משויך - קישור אמיתי ל-Professional.id (יש FK ב-schema, לא ניתן טקסט חופשי).
    // אם עדיין אין בעלי מקצוע רשומים במערכת, השדה פשוט ריק ("לא שויך").
    assigneeProfessionalId: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    status: z.enum(TASK_STATUS_VALUES).default("NOT_STARTED"),
    notes: z.string().optional(),
  })
  .refine((data) => !data.startDate || !data.endDate || data.endDate >= data.startDate, {
    message: "תאריך הסיום לא יכול להיות לפני תאריך ההתחלה",
    path: ["endDate"],
  });

export type TaskInput = z.infer<typeof taskSchema>;

export const moveDirectionSchema = z.enum(["up", "down"]);
export type MoveDirection = z.infer<typeof moveDirectionSchema>;
