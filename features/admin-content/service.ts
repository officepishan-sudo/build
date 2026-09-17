import { ConflictError, ForbiddenError, NotFoundError } from "@/lib/errors";
import { isUserAdmin } from "@/lib/db/admin-access";
import { contentTemplateFormSchema, templateFilterSchema } from "./schema";
import * as repo from "./repository";

async function assertAdmin(userId: string) {
  if (!(await isUserAdmin(userId))) {
    throw new ForbiddenError("מסך זה זמין למנהלי מערכת בלבד");
  }
}

export async function listTemplates(userId: string, filterInput: unknown) {
  await assertAdmin(userId);
  const filter = templateFilterSchema.parse(filterInput);
  return repo.listTemplates(filter);
}

export async function getTemplate(userId: string, id: string) {
  await assertAdmin(userId);
  return findExistingTemplate(id);
}

// עריכה/פרסום כאן משפיעים רק על קריאות עתידיות - שורות Requirement/Decision/Alternative
// שכבר נוצרו מגרסה קודמת של תבנית לא נכתבות מחדש (ר' DEC בדוח - שינוי תוכן לא משנה החלטות קיימות בשקט).
export async function createTemplate(userId: string, input: unknown) {
  await assertAdmin(userId);
  const data = contentTemplateFormSchema.parse(input);
  const existing = await repo.findTemplateByTypeAndKey(data.type, data.key);
  if (existing) throw new ConflictError("כבר קיימת תבנית עם אותו סוג ומפתח");
  return repo.createTemplate({
    type: data.type,
    key: data.key,
    payload: JSON.parse(data.payloadText),
    status: data.status,
  });
}

export async function updateTemplate(userId: string, id: string, input: unknown) {
  await assertAdmin(userId);
  const data = contentTemplateFormSchema.parse(input);
  const current = await findExistingTemplate(id);
  if (data.key !== current.key) {
    const conflict = await repo.findTemplateByTypeAndKey(current.type, data.key);
    if (conflict) throw new ConflictError("כבר קיימת תבנית עם אותו סוג ומפתח");
  }
  return repo.updateTemplate(id, { key: data.key, payload: JSON.parse(data.payloadText), status: data.status });
}

export async function setTemplateStatus(userId: string, id: string, status: "DRAFT" | "PUBLISHED") {
  await assertAdmin(userId);
  await findExistingTemplate(id);
  return repo.setTemplateStatus(id, status);
}

export async function deleteTemplate(userId: string, id: string) {
  await assertAdmin(userId);
  await findExistingTemplate(id);
  return repo.deleteTemplate(id);
}

async function findExistingTemplate(id: string) {
  const template = await repo.findTemplateById(id);
  if (!template) throw new NotFoundError("תבנית תוכן");
  return template;
}
