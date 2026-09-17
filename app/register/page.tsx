import Link from "next/link";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4 py-12">
      <h1 className="mb-1 text-2xl font-semibold">יצירת חשבון</h1>
      <p className="mb-6 text-sm text-gray-500">כמה פרטים כדי להתחיל לנהל את הפרויקט.</p>
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-gray-500">
        כבר יש לכם חשבון?{" "}
        <Link href="/login" className="font-medium text-brand-600 hover:underline">
          התחברות
        </Link>
      </p>
    </main>
  );
}
