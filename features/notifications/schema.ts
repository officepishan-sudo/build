import { z } from "zod";

// עוזר יצירה שיוכל לשמש קוד עתידי בדומיינים אחרים - כל התראה חייבת סיבה (title/body) בפועל.
export const createNotificationSchema = z.object({
  projectId: z.string().min(1),
  userId: z.string().min(1),
  type: z.enum(["INFO", "WARNING", "ACTION_REQUIRED"]).default("INFO"),
  title: z.string().min(1, "כותרת חובה"),
  body: z.string().min(1, "תוכן ההתראה חובה - אין התראה בלי סיבה"),
  sourceType: z.string().trim().optional(),
  sourceId: z.string().trim().optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
