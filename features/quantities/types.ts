export type PhaseOption = { id: string; name: string };

// DTO של שורת כתב כמויות למסך - מספרים רגילים, לא Decimal של Prisma (ראו toQuantityRowDto ב-service.ts).
export type QuantityRowData = {
  id: string;
  phaseId: string | null;
  phase: { id: string; name: string } | null;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  materialCost: number | null;
  laborCost: number | null;
  transportCost: number | null;
  totalCost: number | null;
  source: string | null;
  needsCheck: boolean;
};
