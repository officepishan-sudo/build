import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { QuestionnaireFlow } from "@/features/questionnaire/components/questionnaire-flow";
import { getQuestionnaireState } from "@/features/questionnaire/service";

export default async function QuestionnairePage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();
  const state = await getQuestionnaireState(session.userId, params.projectId);

  return (
    <div>
      <PageHeader
        title="שאלון היכרות עם הפרויקט"
        description="שאלה אחת בכל פעם, אפשר לחזור ולתקן, ואפשר לסמן 'אני לא יודע' - שום דבר לא נעלם."
      />
      <QuestionnaireFlow projectId={params.projectId} questions={state.questions} initialAnswers={state.answers} />
    </div>
  );
}
