import { requireProjectAccess } from "@/lib/auth/rbac";
import { ValidationError } from "@/lib/errors";
import { answerQuestionSchema } from "./schema";
import * as repo from "./repository";

export type QuestionnaireState = {
  questions: { key: string; text: string; helpText: string | null; branch: string | null; order: number }[];
  answers: Record<string, { answerValue: string | null; isUnknown: boolean }>;
};

export async function getQuestionnaireState(userId: string, projectId: string): Promise<QuestionnaireState> {
  await requireProjectAccess(projectId, userId, "VIEW");
  await repo.ensureDefaultQuestions();

  const [questions, answers] = await Promise.all([repo.getActiveQuestions(), repo.getAnswersForProject(projectId)]);

  const answersByKey: QuestionnaireState["answers"] = {};
  for (const a of answers) {
    answersByKey[a.questionKey] = { answerValue: a.answerValue, isUnknown: a.isUnknown };
  }

  return { questions, answers: answersByKey };
}

/**
 * שומר תשובה (כולל "אני לא יודע") - Requirement ו-QuestionnaireAnswer יחד, בלי
 * לגעת בתשובות אחרות. "רענון ענפים חכם" (עדכון ענפים תלויים בלבד) הוא פער ידוע -
 * ראו דוח הסוכן.
 */
export async function saveAnswer(userId: string, projectId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "COMMENT");
  const data = answerQuestionSchema.parse(input);

  const questions = await repo.getActiveQuestions();
  const question = questions.find((q) => q.key === data.questionKey);
  if (!question) {
    throw new ValidationError("שאלה לא מוכרת");
  }

  const [answer] = await Promise.all([
    repo.upsertAnswer(projectId, data.questionKey, { answerValue: data.answerValue, isUnknown: data.isUnknown }),
    repo.upsertRequirementFromAnswer(projectId, question, { answerValue: data.answerValue, isUnknown: data.isUnknown }),
  ]);

  return answer;
}
