import { professionalFilterSchema, createProfessionalSchema } from "./schema";
import * as repo from "./repository";

// מדריך בעלי המקצוע גלובלי (לא תלוי-פרויקט) - אין כאן requireProjectAccess,
// רק requireSession() ברמת ה-action/page (ר' actions.ts).

export async function listProfessionals(input: unknown) {
  const filter = professionalFilterSchema.parse(input);
  return repo.listProfessionals(filter);
}

export async function getProfessionalProfile(id: string) {
  return repo.findProfessionalById(id);
}

export async function createProfessional(input: unknown) {
  const data = createProfessionalSchema.parse(input);
  return repo.createProfessional(data);
}
