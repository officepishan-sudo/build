import { z } from "zod";
import { ASSIGNABLE_SHARE_LEVELS } from "./constants";

// z.enum מוגבל בכוונה לרמות הניתנות להקצאה - OWNER לעולם לא יכולה להתקבל דרך הטופס הזה.
const assignableLevelSchema = z.enum(ASSIGNABLE_SHARE_LEVELS);

export const inviteShareSchema = z.object({
  email: z.string().trim().email("יש להזין כתובת אימייל תקינה"),
  level: assignableLevelSchema,
  domain: z.string().trim().optional(),
});

export type InviteShareInput = z.infer<typeof inviteShareSchema>;

export const changeShareLevelSchema = z.object({
  level: assignableLevelSchema,
  domain: z.string().trim().optional(),
});

export type ChangeShareLevelInput = z.infer<typeof changeShareLevelSchema>;
