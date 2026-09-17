import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./errors";

type Handler = (req: Request, ctx: { params: Record<string, string> }) => Promise<Response>;

/**
 * עוטף route handler: ממיר שגיאות ידועות לתגובת JSON עקבית,
 * ולא חושף פרטי שגיאה פנימיים למשתמש.
 */
export function withHandler(handler: Handler): Handler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (error) {
      if (error instanceof AppError) {
        return NextResponse.json(
          { error: error.message, code: error.code, fieldErrors: (error as { fieldErrors?: unknown }).fieldErrors },
          { status: error.status },
        );
      }
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "הנתונים שהוזנו אינם תקינים", code: "VALIDATION_ERROR", fieldErrors: error.flatten().fieldErrors },
          { status: 400 },
        );
      }
      console.error("[unhandled-error]", error);
      return NextResponse.json({ error: "אירעה שגיאה בלתי צפויה", code: "INTERNAL" }, { status: 500 });
    }
  };
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}
