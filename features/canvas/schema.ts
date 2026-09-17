import { z } from "zod";

// קנבס תכנון (P12) - גרסה מצומצמת: תמונת בסיס אחת לפרויקט (משוכפלת בכל CanvasElement
// לפשטות הסכימה) + פינים במיקום אחוזי (x/y בין 0 ל-100).

export const setBaseImageSchema = z.object({
  imageUrl: z.string().url("יש להזין כתובת URL תקינה לתמונה/שרטוט"),
});

export type SetBaseImageInput = z.infer<typeof setBaseImageSchema>;

const percentSchema = z.coerce.number().min(0, "המיקום חייב להיות בין 0 ל-100").max(100, "המיקום חייב להיות בין 0 ל-100");

export const pinSchema = z.object({
  x: percentSchema,
  y: percentSchema,
  label: z.string().min(1, "יש להזין תווית לפין"),
  note: z.string().optional(),
  linkedRequirementId: z.string().optional(),
});

export type PinInput = z.infer<typeof pinSchema>;
