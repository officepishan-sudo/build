import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SessionPayload } from "@/lib/auth/session";

const NAV_LINKS = [
  { href: "/", label: "הפרויקטים שלי" },
  { href: "/professionals", label: "בעלי מקצוע" },
  { href: "/suppliers", label: "ספקים" },
  { href: "/notifications", label: "התראות" },
];

type AppShellProps = {
  session: SessionPayload;
  children: React.ReactNode;
  // shared components/ never import features/ directly - the caller (an app/ route) passes
  // its feature's server action in as a prop.
  onLogout: () => Promise<void>;
};

export function AppShell({ session, children, onLogout }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-lg font-bold text-brand-700">
              ניהול פרויקט בנייה
            </Link>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-gray-600 hover:text-brand-600">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500">שלום, {session.name}</span>
            <form action={onLogout}>
              <Button type="submit" variant="ghost">
                התנתקות
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
