import { z } from "zod";
import { TEMPLATE_STATUS_VALUES, TEMPLATE_TYPE_VALUES } from "./constants";

function isValidJson(value: string): boolean {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

export const contentTemplateFormSchema = z.object({
  type: z.enum(TEMPLATE_TYPE_VALUES, { errorMap: () => ({ message: "יש לבחור סוג תוכן" }) }),
  key: z.string().min(1, "יש להזין מפתח (key) ייחודי בתוך הסוג"),
  payloadText: z.string().min(1, "יש להזין תוכן JSON").refine(isValidJson, "התוכן חייב להיות JSON תקין"),
  status: z.enum(TEMPLATE_STATUS_VALUES).default("DRAFT"),
});

export type ContentTemplateFormInput = z.infer<typeof contentTemplateFormSchema>;

function emptyToUndefined(value: unknown) {
  return value === "" || value === null ? undefined : value;
}

export const templateFilterSchema = z.object({
  type: z.preprocess(emptyToUndefined, z.enum(TEMPLATE_TYPE_VALUES).optional()),
  status: z.preprocess(emptyToUndefined, z.enum(TEMPLATE_STATUS_VALUES).optional()),
});

export type TemplateFilterInput = z.infer<typeof templateFilterSchema>;
