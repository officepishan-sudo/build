import Link from "next/link";
import { EmptyState } from "@/components/ui/states";
import { listScheduleBoard } from "../service";
import { PhaseItem } from "./phase-item";
import { AddPhase } from "./add-phase";

export async function ScheduleScreen({
  userId,
  projectId,
  deliveryCountsByPhase,
}: {
  userId: string;
  projectId: string;
  deliveryCountsByPhase: Record<string, number>;
}) {
  const { phases, professionals } = await listScheduleBoard(userId, projectId);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href={`/projects/${projectId}/calendar`} className="text-sm text-brand-700 hover:underline">
          מעבר ללוח שנה מאוחד ←
        </Link>
      </div>

      {phases.length === 0 ? (
        <EmptyState title="עדיין אין שלבים בלוח הזמנים" description="הוסיפו שלב ראשון כדי להתחיל לתכנן את סדר העבודה." />
      ) : (
        <div className="space-y-3">
          {phases.map((phase, index) => (
            <PhaseItem
              key={phase.id}
              projectId={projectId}
              phase={phase}
              allPhases={phases}
              professionals={professionals}
              deliveryCount={deliveryCountsByPhase[phase.id]}
              isFirst={index === 0}
              isLast={index === phases.length - 1}
            />
          ))}
        </div>
      )}

      <AddPhase projectId={projectId} phases={phases} />
    </div>
  );
}
