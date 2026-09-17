import { z } from "zod";

// גוף ההודעה חובה - הודעה ריקה לא נשלחת. שאר השדות משלימים הקשר (סעיף 9: relatedType/relatedId).
export const sendMessageSchema = z.object({
  body: z.string().min(1, "יש לכתוב תוכן להודעה"),
  relatedType: z.string().trim().optional(),
  relatedId: z.string().trim().optional(),
  existingDocumentId: z.string().trim().optional(),
  newDocumentName: z.string().trim().optional(),
  newDocumentUrl: z.string().trim().optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
