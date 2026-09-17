import { requireProjectAccess } from "@/lib/auth/rbac";
import { NotFoundError } from "@/lib/errors";
import { checklistTemplatePayloadSchema, updateChecklistItemSchema } from "./schema";
import * as repo from "./repository";

export async function getChecklistState(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  const items = await repo.listChecklistItems(projectId);
  if (items.length > 0) {
    return { items, canSeed: false };
  }
  const project = await repo.findProjectType(projectId);
  if (!project) return { items, canSeed: false };
  const templates = await repo.listPublishedChecklistTemplates();
  return { items, canSeed: findMatchingTemplates(templates, project.type).length > 0 };
}

export async function seedChecklist(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  const existing = await repo.listChecklistItems(projectId);
  if (existing.length > 0) return existing; // כבר קיימת רשימה - לא כופלים

  const project = await repo.findProjectType(projectId);
  if (!project) throw new NotFoundError("פרויקט");

  const templates = await repo.listPublishedChecklistTemplates();
  const matching = findMatchingTemplates(templates, project.type);
  if (matching.length === 0) return [];

  await repo.createChecklistItemsFromTemplates(projectId, matching);
  return repo.listChecklistItems(projectId);
}

export async function updateChecklistItem(userId: string, projectId: string, itemId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  const data = updateChecklistItemSchema.parse(input);
  await findExistingItem(projectId, itemId);
  return repo.updateChecklistItem(itemId, data);
}

/** מסננת תבניות CHECKLIST_ITEM שה-payload שלהן תקין ומתאים לסוג הפרויקט - payload פגום מדולג בשקט, לא קורס. */
function findMatchingTemplates(
  templates: { payload: unknown }[],
  projectType: string,
): { title: string; description?: string }[] {
  const result: { title: string; description?: string }[] = [];
  for (const template of templates) {
    const parsed = checklistTemplatePayloadSchema.safeParse(template.payload);
    if (parsed.success && parsed.data.projectType === projectType) {
      result.push({ title: parsed.data.title, description: parsed.data.description });
    }
  }
  return result;
}

async function findExistingItem(projectId: string, itemId: string) {
  const item = await repo.findChecklistItemById(projectId, itemId);
  if (!item) throw new NotFoundError("סעיף רגולציה");
  return item;
}
