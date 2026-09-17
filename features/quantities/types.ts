export type PhaseOption = { id: string; name: string };

// צורת שורת כתב כמויות כפי שחוזרת מ-repository.listQuantityItems (כולל שלב משויך).
export type QuantityRowData = {
  id: string;
  phaseId: string | null;
  phase: { id: string; name: string } | null;
  category: string;
  description: string;
  quantity: unknown;
  unit: string;
  materialCost: unknown;
  laborCost: unknown;
  transportCost: unknown;
  totalCost: unknown;
  source: string | null;
  needsCheck: boolean;
};
