import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { DEFECT_STATUS_LABEL, DEFECT_STATUS_TONE } from "../constants";

type DefectRowData = {
  id: string;
  title: string;
  description: string;
  status: keyof typeof DEFECT_STATUS_LABEL;
  dueDate: Date | null;
  assignee: { name: string } | null;
  _count: { photos: number };
};

export function DefectRow({ projectId, defect }: { projectId: string; defect: DefectRowData }) {
  return (
    <li className="py-3">
      <Link href={`/projects/${projectId}/punch-list/${defect.id}`} className="flex flex-col gap-1 rounded-md p-2 -m-2 hover:bg-gray-50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-medium text-gray-900">{defect.title}</span>
          <Badge tone={DEFECT_STATUS_TONE[defect.status]}>{DEFECT_STATUS_LABEL[defect.status]}</Badge>
        </div>
        <p className="text-sm text-gray-500">{defect.description}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          {defect.assignee && <span>אחראי: {defect.assignee.name}</span>}
          {defect.dueDate && <span>יעד: {formatDate(defect.dueDate)}</span>}
          {defect._count.photos > 0 && (
            <Link href={`/projects/${projectId}/photos?defectId=${defect.id}`} className="text-brand-600 hover:underline">
              {defect._count.photos} תמונות
            </Link>
          )}
        </div>
      </Link>
    </li>
  );
}
