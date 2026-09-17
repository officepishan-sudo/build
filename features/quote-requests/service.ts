import { requireProjectAccess } from "@/lib/auth/rbac";
import { NotFoundError, ValidationError, ConflictError } from "@/lib/errors";
import { listProfessionalsByIds, listSuppliersByIds } from "@/lib/db/directory-lookups";
import { quoteRequestFormSchema } from "./schema";
import * as repo from "./repository";

const MISSING_FOR_SEND_MESSAGE = "יש להוסיף סעיפים/מפרט ולבחור לפחות נמען אחד לפני שליחה";

export async function listQuoteRequests(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  return repo.listQuoteRequestsForProject(projectId);
}

export async function getQuoteRequestDetail(userId: string, projectId: string, id: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  const quoteRequest = await repo.findQuoteRequestById(id, projectId);
  if (!quoteRequest) throw new NotFoundError("בקשת הצעת מחיר");

  const professionalIds = quoteRequest.recipients.map((r) => r.professionalId).filter((v): v is string => Boolean(v));
  const supplierIds = quoteRequest.recipients.map((r) => r.supplierId).filter((v): v is string => Boolean(v));
  const [professionals, suppliers] = await Promise.all([
    listProfessionalsByIds(professionalIds),
    listSuppliersByIds(supplierIds),
  ]);
  return { quoteRequest, professionals, suppliers };
}

export async function submitQuoteRequest(
  userId: string,
  projectId: string,
  input: unknown,
  intent: "draft" | "send",
) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const data = quoteRequestFormSchema.parse(input);
  const recipients = [
    ...data.recipientProfessionalIds.map((id) => ({ professionalId: id })),
    ...data.recipientSupplierIds.map((id) => ({ supplierId: id })),
  ];
  if (intent === "send" && (recipients.length === 0 || data.scopeText.trim() === "")) {
    throw new ValidationError(MISSING_FOR_SEND_MESSAGE);
  }
  return repo.createQuoteRequest(projectId, data, intent === "send" ? "SENT" : "DRAFT", recipients);
}

export async function sendDraft(userId: string, projectId: string, id: string) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const quoteRequest = await repo.findQuoteRequestById(id, projectId);
  if (!quoteRequest) throw new NotFoundError("בקשת הצעת מחיר");
  if (quoteRequest.status !== "DRAFT") throw new ConflictError("הבקשה כבר נשלחה או בוטלה - אי אפשר לשלוח שוב");
  if (quoteRequest.recipients.length === 0 || quoteRequest.scopeText.trim() === "") {
    throw new ValidationError(MISSING_FOR_SEND_MESSAGE);
  }
  return repo.sendQuoteRequest(id);
}

export async function cancelQuoteRequest(userId: string, projectId: string, id: string) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const quoteRequest = await repo.findQuoteRequestById(id, projectId);
  if (!quoteRequest) throw new NotFoundError("בקשת הצעת מחיר");
  return repo.cancelQuoteRequest(id);
}
