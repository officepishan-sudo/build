import { prisma } from "@/lib/prisma";
import { requireProjectAccess } from "@/lib/auth/rbac";
import { computeWarrantyStatus, type WarrantyStatus } from "@/features/warranty/warranty-status";

// אגרגציה חוצת-דומיינים לצורך ספר הפרויקט (P36) בלבד - קריאה ישירה ל-Prisma מותרת
// כאן (app/**/_lib/*) בדיוק כמו בדשבורד, כדי לא ליצור תלות של features/project-book
// בפיצ'רים של סוכנים אחרים. כל שאילתת דומיין בפונקציה קטנה משלה, עטופה כך שטבלה ריקה
// או פיצ'ר שעדיין נבנה לא יפילו את כל העמוד (loadSection בולעת שגיאה ומחזירה failed=true).

export type BookSection<T> = { count: number; items: T[]; failed: boolean };

export type ProjectBookData = {
  project: { id: string; name: string; type: string; status: string; createdAt: Date } | null;
  isFinished: boolean;
  decisions: BookSection<{ id: string; title: string; status: string; deadline: Date | null }>;
  quantityItems: BookSection<{ id: string; description: string; category: string; totalCost: number | null }>;
  quotes: BookSection<{ id: string; price: number; status: string; partyName: string | null }>;
  orders: BookSection<{ id: string; number: string; status: string; totalAmount: number }>;
  documents: BookSection<{ id: string; name: string; category: string }>;
  photos: BookSection<{ id: string; url: string; caption: string | null }>;
  payments: BookSection<{ id: string; payeeName: string; amount: number; status: string }>;
  warranties: BookSection<{ id: string; itemDescription: string; status: WarrantyStatus; expiryDate: Date }>;
  maintenanceItems: BookSection<{ id: string; title: string; nextDueDate: Date | null }>;
  regulatoryItems: BookSection<{ id: string; title: string; isChecked: boolean }>;
};

const TAKE = 20;
const FINISHED_STATUSES = new Set(["COMPLETED", "ARCHIVED"]);

async function loadSection<T>(loader: () => Promise<{ count: number; items: T[] }>): Promise<BookSection<T>> {
  try {
    const { count, items } = await loader();
    return { count, items, failed: false };
  } catch (error) {
    console.error("[project-book-section-error]", error);
    return { count: 0, items: [], failed: true };
  }
}

function loadProjectSummary(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, name: true, type: true, status: true, createdAt: true },
  });
}

function loadDecisions(projectId: string) {
  return loadSection(async () => {
    const [count, items] = await Promise.all([
      prisma.decision.count({ where: { projectId } }),
      prisma.decision.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
        take: TAKE,
        select: { id: true, title: true, status: true, deadline: true },
      }),
    ]);
    return { count, items };
  });
}

function loadQuantityItems(projectId: string) {
  return loadSection(async () => {
    const [count, rows] = await Promise.all([
      prisma.quantityItem.count({ where: { projectId } }),
      prisma.quantityItem.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
        take: TAKE,
        select: { id: true, description: true, category: true, totalCost: true },
      }),
    ]);
    return { count, items: rows.map((r) => ({ ...r, totalCost: r.totalCost ? Number(r.totalCost) : null })) };
  });
}

function loadQuotes(projectId: string) {
  return loadSection(async () => {
    const [count, rows] = await Promise.all([
      prisma.quote.count({ where: { projectId } }),
      prisma.quote.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
        take: TAKE,
        select: {
          id: true,
          price: true,
          status: true,
          supplier: { select: { name: true } },
          professional: { select: { name: true } },
        },
      }),
    ]);
    const items = rows.map((r) => ({
      id: r.id,
      price: Number(r.price),
      status: r.status,
      partyName: r.supplier?.name ?? r.professional?.name ?? null,
    }));
    return { count, items };
  });
}

function loadOrders(projectId: string) {
  return loadSection(async () => {
    const [count, rows] = await Promise.all([
      prisma.order.count({ where: { projectId } }),
      prisma.order.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
        take: TAKE,
        select: { id: true, number: true, status: true, totalAmount: true },
      }),
    ]);
    return { count, items: rows.map((r) => ({ ...r, totalAmount: Number(r.totalAmount) })) };
  });
}

function loadDocuments(projectId: string) {
  return loadSection(async () => {
    const [count, items] = await Promise.all([
      prisma.document.count({ where: { projectId } }),
      prisma.document.findMany({
        where: { projectId },
        orderBy: { uploadedAt: "desc" },
        take: TAKE,
        select: { id: true, name: true, category: true },
      }),
    ]);
    return { count, items };
  });
}

function loadPhotos(projectId: string) {
  return loadSection(async () => {
    const [count, items] = await Promise.all([
      prisma.photo.count({ where: { projectId } }),
      prisma.photo.findMany({
        where: { projectId },
        orderBy: { takenAt: "desc" },
        take: TAKE,
        select: { id: true, url: true, caption: true },
      }),
    ]);
    return { count, items };
  });
}

function loadPayments(projectId: string) {
  return loadSection(async () => {
    const [count, rows] = await Promise.all([
      prisma.payment.count({ where: { projectId } }),
      prisma.payment.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
        take: TAKE,
        select: { id: true, payeeName: true, amount: true, status: true },
      }),
    ]);
    return { count, items: rows.map((r) => ({ ...r, amount: Number(r.amount) })) };
  });
}

function loadWarranties(projectId: string) {
  return loadSection(async () => {
    const [count, rows] = await Promise.all([
      prisma.warranty.count({ where: { projectId } }),
      prisma.warranty.findMany({
        where: { projectId },
        orderBy: { startDate: "desc" },
        take: TAKE,
        select: { id: true, itemDescription: true, startDate: true, durationMonths: true },
      }),
    ]);
    const items = rows.map((r) => ({
      id: r.id,
      itemDescription: r.itemDescription,
      ...computeWarrantyStatus(r.startDate, r.durationMonths),
    }));
    return { count, items };
  });
}

function loadMaintenanceItems(projectId: string) {
  return loadSection(async () => {
    const [count, items] = await Promise.all([
      prisma.maintenanceItem.count({ where: { projectId } }),
      prisma.maintenanceItem.findMany({
        where: { projectId },
        orderBy: [{ nextDueDate: "asc" }, { createdAt: "desc" }],
        take: TAKE,
        select: { id: true, title: true, nextDueDate: true },
      }),
    ]);
    return { count, items };
  });
}

function loadRegulatoryItems(projectId: string) {
  return loadSection(async () => {
    const [count, items] = await Promise.all([
      prisma.regulatoryChecklistItem.count({ where: { projectId } }),
      prisma.regulatoryChecklistItem.findMany({
        where: { projectId },
        orderBy: { createdAt: "asc" },
        take: TAKE,
        select: { id: true, title: true, isChecked: true },
      }),
    ]);
    return { count, items };
  });
}

export async function loadProjectBook(userId: string, projectId: string): Promise<ProjectBookData> {
  await requireProjectAccess(projectId, userId, "VIEW");

  const [project, decisions, quantityItems, quotes, orders, documents, photos, payments, warranties, maintenanceItems, regulatoryItems] =
    await Promise.all([
      loadProjectSummary(projectId),
      loadDecisions(projectId),
      loadQuantityItems(projectId),
      loadQuotes(projectId),
      loadOrders(projectId),
      loadDocuments(projectId),
      loadPhotos(projectId),
      loadPayments(projectId),
      loadWarranties(projectId),
      loadMaintenanceItems(projectId),
      loadRegulatoryItems(projectId),
    ]);

  return {
    project,
    isFinished: project ? FINISHED_STATUSES.has(project.status) : false,
    decisions,
    quantityItems,
    quotes,
    orders,
    documents,
    photos,
    payments,
    warranties,
    maintenanceItems,
    regulatoryItems,
  };
}
