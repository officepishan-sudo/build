"use server";

import { redirect } from "next/navigation";
import { AppError } from "@/lib/errors";
import { clearSessionCookie } from "@/lib/auth/session";
import * as service from "./service";

export type AuthFormState = { error?: string; fieldErrors?: Record<string, string[]> } | null;

export async function loginAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  try {
    await service.login({
      email: formData.get("email"),
      password: formData.get("password"),
    });
  } catch (error) {
    return toFormState(error);
  }
  redirect("/");
}

export async function registerAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  try {
    await service.register({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      phone: formData.get("phone") || undefined,
    });
  } catch (error) {
    return toFormState(error);
  }
  redirect("/");
}

export async function logoutAction() {
  clearSessionCookie();
  redirect("/login");
}

function toFormState(error: unknown): AuthFormState {
  if (error instanceof AppError) {
    return { error: error.message, fieldErrors: (error as { fieldErrors?: Record<string, string[]> }).fieldErrors };
  }
  console.error("[auth-action-error]", error);
  return { error: "אירעה שגיאה בלתי צפויה, נסו שוב" };
}
