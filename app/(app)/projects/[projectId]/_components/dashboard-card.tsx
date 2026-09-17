import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

// עטיפה גנרית לכרטיס בדשבורד - "כרטיס -> יעד רלוונטי" (Edge Case ב-P11):
// כל כרטיס הוא קישור אמיתי למסך המלא, לא תצוגה מתה.
export function DashboardCard({ title, href, children }: { title: string; href: string; children: ReactNode }) {
  return (
    <Link href={href} className="block h-full">
      <Card className="h-full transition hover:border-brand-400 hover:shadow-md">
        <h3 className="mb-2 text-sm font-semibold text-gray-700">{title}</h3>
        {children}
      </Card>
    </Link>
  );
}
