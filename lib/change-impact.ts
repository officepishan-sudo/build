import {
  loadAffectedQuantityItems,
  loadAffectedRequirements,
  loadOrdersWithCommitments,
  loadPaymentsAlreadyMade,
  loadQuotesNoLongerValid,
  loadTasksAlreadyDone,
  type AffectedQuantityItemSummary,
  type AffectedRequirementSummary,
  type OrderCommitmentSummary,
  type PaymentAlreadyMadeSummary,
  type QuoteNoLongerValidSummary,
  type TaskAlreadyDoneSummary,
} from "@/lib/db/change-impact-reads";

// חישוב השפעת שינוי (סעיף 8.1) - לוגיקה חוצת-פיצ'רים, קריאה בלבד, בלי גישה ישירה
// ל-Prisma (זו חיה ב-lib/db/change-impact-reads.ts, לפי כלל ה-boundaries של הריפו).
// חי ב-lib כי כמה פיצ'רים (חלופות, בקשות שינוי עתידיות) צריכים אותה לוגיקה משותפת.

export type {
  AffectedQuantityItemSummary,
  AffectedRequirementSummary,
  OrderCommitmentSummary,
  PaymentAlreadyMadeSummary,
  QuoteNoLongerValidSummary,
  TaskAlreadyDoneSummary,
};

export type ChangeImpactInput = {
  projectId: string;
  changeDescription: string;
  affectedRequirementIds?: string[];
  affectedQuoteIds?: string[];
  affectedOrderIds?: string[];
  affectedQuantityItemIds?: string[];
};

export type ChangeImpactResult = {
  projectId: string;
  changeDescription: string;
  affectedRequirements: AffectedRequirementSummary[];
  affectedQuantityItems: AffectedQuantityItemSummary[];
  quotesNoLongerValid: QuoteNoLongerValidSummary[];
  ordersWithCommitments: OrderCommitmentSummary[];
  paymentsAlreadyMade: PaymentAlreadyMadeSummary[];
  tasksAlreadyDone: TaskAlreadyDoneSummary[];
  needsReviewCount: number;
  // יש עובדה בשטח שכבר קרתה (הזמנה שסופקה/בביצוע, תשלום, משימה שהושלמה) -
  // לא ניתן "לבטל" אותה, רק לתעד ולתאם.
  hasIrreversibleFacts: boolean;
};

function computeNeedsReviewCount(
  requirements: AffectedRequirementSummary[],
  quotes: QuoteNoLongerValidSummary[],
  orders: OrderCommitmentSummary[],
): number {
  const needsCheckRequirements = requirements.filter((r) => r.status === "NEEDS_CHECK").length;
  const ordersNeedingDecision = orders.filter((o) => !o.alreadyHappened).length;
  return quotes.length + ordersNeedingDecision + needsCheckRequirements;
}

/**
 * מציג "מה זה נוגע בו" לפי מה שכבר קיים בפרויקט (הצעות/הזמנות/תשלומים/ביצוע) -
 * לפני הצעות, אחרי הצעות, אחרי הזמנה, אחרי תשלום, אחרי ביצוע (סעיף 8.1).
 * קריאה בלבד - אף כתיבה לא קורית כאן; האישור בפועל הוא ב-features/change-impact.
 */
export async function computeChangeImpact(input: ChangeImpactInput): Promise<ChangeImpactResult> {
  const affectedRequirementIds = input.affectedRequirementIds ?? [];
  const affectedQuoteIds = input.affectedQuoteIds ?? [];
  const affectedOrderIds = input.affectedOrderIds ?? [];
  const affectedQuantityItemIds = input.affectedQuantityItemIds ?? [];

  const [affectedRequirements, affectedQuantityItems, quotesNoLongerValid, ordersWithCommitments, tasksAlreadyDone] =
    await Promise.all([
      loadAffectedRequirements(input.projectId, affectedRequirementIds),
      loadAffectedQuantityItems(input.projectId, affectedQuantityItemIds),
      loadQuotesNoLongerValid(input.projectId, affectedQuoteIds),
      loadOrdersWithCommitments(input.projectId, affectedOrderIds),
      loadTasksAlreadyDone(input.projectId, affectedQuantityItemIds),
    ]);

  const paymentsAlreadyMade = await loadPaymentsAlreadyMade(input.projectId, affectedOrderIds, affectedQuoteIds);

  const hasIrreversibleFacts =
    ordersWithCommitments.some((o) => o.alreadyHappened) || paymentsAlreadyMade.length > 0 || tasksAlreadyDone.length > 0;

  return {
    projectId: input.projectId,
    changeDescription: input.changeDescription,
    affectedRequirements,
    affectedQuantityItems,
    quotesNoLongerValid,
    ordersWithCommitments,
    paymentsAlreadyMade,
    tasksAlreadyDone,
    needsReviewCount: computeNeedsReviewCount(affectedRequirements, quotesNoLongerValid, ordersWithCommitments),
    hasIrreversibleFacts,
  };
}
