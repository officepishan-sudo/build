import { z } from "zod";

export const answerQuestionSchema = z.object({
  questionKey: z.string().min(1),
  answerValue: z.string().trim().max(2000).optional(),
  isUnknown: z.coerce.boolean().default(false),
});

export type AnswerQuestionInput = z.infer<typeof answerQuestionSchema>;
