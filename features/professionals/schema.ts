import { z } from "zod";

export const professionalFilterSchema = z.object({
  field: z.string().optional(),
  area: z.string().optional(),
});
export type ProfessionalFilterInput = z.infer<typeof professionalFilterSchema>;

export const createProfessionalSchema = z.object({
  name: z.string().min(2, "יש להזין שם"),
  fields: z.array(z.string()).min(1, "יש לבחור תחום אחד לפחות"),
  area: z.string().min(1, "יש להזין אזור פעילות"),
  experienceYears: z.coerce.number().int().nonnegative().optional(),
  responseTimeHours: z.coerce.number().int().positive().optional(),
  bio: z.string().optional(),
});
export type CreateProfessionalInput = z.infer<typeof createProfessionalSchema>;
