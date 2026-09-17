import { z } from "zod";

export const addPhotoSchema = z.object({
  url: z.string().min(1, "יש להדביק קישור לתמונה"),
  takenAt: z.coerce.date().optional(),
  phaseId: z.string().trim().optional(),
  caption: z.string().trim().optional(),
  isBeforeAfter: z.coerce.boolean().default(false),
});

export type AddPhotoInput = z.infer<typeof addPhotoSchema>;

// עריכה היא פעולה מפורשת ונפרדת - כולל שינוי שלב (edge case: לא לשנות הקשר בשקט).
export const editPhotoSchema = addPhotoSchema;
export type EditPhotoInput = z.infer<typeof editPhotoSchema>;
