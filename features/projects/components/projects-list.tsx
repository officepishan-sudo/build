import Link from "next/link";
import { EmptyState } from "@/components/ui/states";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "./project-card";
import { listMyProjects } from "../service";

export async function ProjectsList({ userId }: { userId: string }) {
  const projects = await listMyProjects(userId);

  if (projects.length === 0) {
    return (
      <EmptyState
        title="עדיין אין לכם פרויקטים"
        description="אפשר להתחיל פרויקט חדש מאפס, או להכניס פרויקט שכבר התחיל כדי להמשיך בדיוק מאיפה שעצרתם."
        action={
          <Link href="/onboarding">
            <Button>להתחלה</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
