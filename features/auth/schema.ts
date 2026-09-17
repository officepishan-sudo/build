import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z.string().min(1, "יש להזין סיסמה"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "יש להזין שם מלא"),
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z.string().min(8, "הסיסמה חייבת להכיל לפחות 8 תווים"),
  phone: z.string().optional(),
});
