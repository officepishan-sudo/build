import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(2, "יש להזין שם לפרויקט"),
  type: z.enum([
    "NEW_HOME",
    "RENOVATION",
    "YARD_GARDEN",
    "FENCE_GATE",
    "PARKING",
    "PERGOLA",
    "INFRASTRUCTURE",
    "INTERIOR_DESIGN",
    "OTHER",
  ]),
  scopeDescription: z.string().optional(),
  startDateKnown: z.coerce.boolean().default(false),
  startDate: z.coerce.date().optional(),
  track: z.enum(["FULL", "QUOTES_ONLY"]).default("FULL"),
  isExistingProject: z.coerce.boolean().default(false),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const pauseProjectSchema = z.object({
  reason: z.string().optional(),
});
