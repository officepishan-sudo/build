import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Supplier } from "@prisma/client";

export function SupplierCard({ supplier }: { supplier: Supplier }) {
  return (
    <Link href={`/suppliers/${supplier.id}`}>
      <Card className="h-full transition hover:border-brand-400 hover:shadow-md">
        <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
        <div className="mt-1 flex flex-wrap gap-1">
          {supplier.categories.map((c) => (
            <Badge key={c}>{c}</Badge>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-500">אזור: {supplier.area ?? "לא צויין"}</p>
        {supplier.terms && <p className="mt-1 line-clamp-2 text-sm text-gray-500">תנאים: {supplier.terms}</p>}
      </Card>
    </Link>
  );
}
