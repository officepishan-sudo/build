import Link from "next/link";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4 py-12">
      <h1 className="mb-1 text-2xl font-semibold">התחברות</h1>
      <p className="mb-6 text-sm text-gray-500">ניהול פרויקט הבנייה שלכם - מרעיון ועד מסירה.</p>
      <LoginForm />
      <p className="mt-6 text-center text-sm text-gray-500">
        אין לכם חשבון?{" "}
        <Link href="/register" className="font-medium text-brand-600 hover:underline">
          הרשמה
        </Link>
      </p>
    </main>
  );
}
