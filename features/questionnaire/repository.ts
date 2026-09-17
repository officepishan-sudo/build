import { prisma } from "@/lib/prisma";
import { DEFAULT_QUESTIONS } from "./default-questions";

/**
 * טוען את סט השאלות ברירת המחדל אם עוד אין שאלות פעילות במערכת (אידמפוטנטי -
 * מבוסס על key ייחודי). לא עורך את prisma/seed.ts כדי לא להתנגש עם סוכנים אחרים.
 */
export async function ensureDefaultQuestions(): Promise<void> {
  const existingCount = await prisma.questionnaireQuestion.count();
  if (existingCount > 0) return;

  await prisma.questionnaireQuestion.createMany({
    data: DEFAULT_QUESTIONS.map((q) => ({
      key: q.key,
      text: q.text,
      helpText: q.helpText,
      branch: q.branch,
      order: q.order,
    })),
    skipDuplicates: true,
  });
}

export function getActiveQuestions() {
  return prisma.questionnaireQuestion.findMany({ where: { active: true }, orderBy: { order: "asc" } });
}

export function getAnswersForProject(projectId: string) {
  return prisma.questionnaireAnswer.findMany({ where: { projectId } });
}

export function upsertAnswer(
  projectId: string,
  questionKey: string,
  data: { answerValue?: string; isUnknown: boolean },
) {
  return prisma.questionnaireAnswer.upsert({
    where: { projectId_questionKey: { projectId, questionKey } },
    update: { answerValue: data.answerValue, isUnknown: data.isUnknown, updatedAt: new Date() },
    create: { projectId, questionKey, answerValue: data.answerValue, isUnknown: data.isUnknown },
  });
}

/**
 * "אני לא יודע" או שאלה שלא נענתה לעולם לא מסירה דרישה - תמיד נשמרת שורה מפורשת,
 * עם status=NEEDS_CHECK כשהתשובה לא ידועה. Requirement אין לו unique([projectId,key])
 * בסכימה, לכן find-then-write ולא prisma upsert.
 */
export async function upsertRequirementFromAnswer(
  projectId: string,
  question: { key: string; text: string },
  data: { answerValue?: string; isUnknown: boolean },
) {
  const existing = await prisma.requirement.findFirst({ where: { projectId, key: question.key } });
  const payload = {
    label: question.text,
    value: data.isUnknown ? null : (data.answerValue ?? null),
    status: data.isUnknown ? ("NEEDS_CHECK" as const) : ("KNOWN" as const),
    source: "questionnaire",
  };

  if (existing) {
    return prisma.requirement.update({ where: { id: existing.id }, data: payload });
  }
  return prisma.requirement.create({ data: { projectId, key: question.key, ...payload } });
}
