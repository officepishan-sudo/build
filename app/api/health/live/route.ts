import { NextResponse } from "next/server";

// בדיקת חיות בסיסית - בלי תלות ב-DB, לשימוש smoke/deploy מהיר.
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
