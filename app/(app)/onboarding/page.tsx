import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";

const OPTIONS = [
  {
    href: "/projects/new",
    title: "התחלה מהירה",
    description: "פרויקט חדש מאפס - שאלון קצר יוביל אתכם לחלופות ולתכנון.",
  },
  {
    href: "/projects/new?mode=existing",
    title: "כבר באמצע פרויקט",
    description: "יש לכם כבר תכנון, הצעות או ספקים? נכניס את המצב הקיים בלי להתחיל מחדש.",
  },
  {
    href: "/projects/new?track=quotes-only",
    title: "רק הצעות מחיר",
    description: "רוצים רק לקבל ולהשוות הצעות מחיר לעבודה מסוימת, בלי לנהל את כל הפרויקט.",
  },
];

export default function OnboardingPage() {
  return (
    <div>
      <PageHeader title="בואו נתחיל" description="בחרו את המסלול שהכי מתאים לכם עכשיו - אפשר תמיד לשנות בהמשך." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {OPTIONS.map((option) => (
          <Link key={option.href} href={option.href}>
            <Card className="h-full transition hover:border-brand-400 hover:shadow-md">
              <h3 className="font-semibold text-gray-900">{option.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{option.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
