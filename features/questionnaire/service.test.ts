import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { createTestProject, createTestUser } from "../../tests/helpers/factories";
import { getQuestionnaireState, saveAnswer } from "./service";
import { DEFAULT_QUESTIONS } from "./default-questions";

describe("questionnaire service", () => {
  it("טוענת את סט השאלות ברירת המחדל בפעם הראשונה בלבד (אידמפוטנטי)", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);

    const first = await getQuestionnaireState(owner.id, project.id);
    const second = await getQuestionnaireState(owner.id, project.id);

    expect(first.questions).toHaveLength(DEFAULT_QUESTIONS.length);
    expect(second.questions).toHaveLength(DEFAULT_QUESTIONS.length);
  });

  it("'אני לא יודע' שומר Requirement מפורש עם NEEDS_CHECK - ולא מדלג על השורה", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    await getQuestionnaireState(owner.id, project.id); // מוודא שהשאלות קיימות

    const key = DEFAULT_QUESTIONS[0].key;
    await saveAnswer(owner.id, project.id, { questionKey: key, isUnknown: true });

    const requirement = await prisma.requirement.findFirst({ where: { projectId: project.id, key } });
    const answer = await prisma.questionnaireAnswer.findUnique({
      where: { projectId_questionKey: { projectId: project.id, questionKey: key } },
    });

    expect(requirement).not.toBeNull();
    expect(requirement?.status).toBe("NEEDS_CHECK");
    expect(answer?.isUnknown).toBe(true);
  });

  it("עדכון תשובה קיימת שומר ומעדכן בלי לאבד תשובות אחרות", async () => {
    const owner = await createTestUser();
    const project = await createTestProject(owner.id);
    await getQuestionnaireState(owner.id, project.id);

    const [firstKey, secondKey] = DEFAULT_QUESTIONS.map((q) => q.key);
    await saveAnswer(owner.id, project.id, { questionKey: firstKey, answerValue: "תשובה א", isUnknown: false });
    await saveAnswer(owner.id, project.id, { questionKey: secondKey, answerValue: "תשובה ב", isUnknown: false });

    await saveAnswer(owner.id, project.id, { questionKey: firstKey, answerValue: "תשובה א מעודכנת", isUnknown: false });

    const state = await getQuestionnaireState(owner.id, project.id);
    expect(state.answers[firstKey].answerValue).toBe("תשובה א מעודכנת");
    expect(state.answers[secondKey].answerValue).toBe("תשובה ב");
  });
});
