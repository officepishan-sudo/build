"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { AppError } from "@/lib/errors";
import * as service from "./service";

export type ProfessionalFormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

export async function createProfessionalAction(
  _prev: ProfessionalFormState,
  formData: FormData,
): Promise<ProfessionalFormState> {
  await requireSession();
  try {
    await service.createProfessional({
      name: formData.get("name"),
      fields: formData.getAll("fields"),
      area: formData.get("area"),
      experienceYears: formData.get("experienceYears") || undefined,
      responseTimeHours: formData.get("responseTimeHours") || undefined,
      bio: formData.get("bio") || undefined,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
    }
    console.error("[create-professional-error]", error);
    return { error: "לא הצלחנו להוסיף את בעל המקצוע, נסו שוב" };
  }
  revalidatePath("/professionals");
  return null;
}
