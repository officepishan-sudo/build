import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ניהול פרויקט בנייה",
  description: "מהרעיון לפרויקט הבנייה - דרישות, חלופות, תקציב, ספקים וביצוע במקום אחד",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
