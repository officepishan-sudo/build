// חישובים טהורים ליצירת הזמנות מתוך שורות עגלה - בלי Prisma, קלים לבדיקה.

export type CartLineForOrder = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number | null;
  supplierId: string | null;
  phaseId: string | null;
};

export type OrderLine = {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type OrderGroup = {
  supplierId: string;
  phaseId: string | null;
  lines: OrderLine[];
  totalAmount: number;
  sourceCartItemIds: string[];
};

/** כל שורה נבחרת חייבת כמות>0 וספק - כלל P20: "אין הזמנה בלי ספק וכמות". */
export function findInvalidCartLines(lines: CartLineForOrder[]): CartLineForOrder[] {
  return lines.filter((line) => !(line.quantity > 0) || !line.supplierId);
}

/** מקבץ שורות עגלה תקינות להזמנות - הזמנה אחת לכל ספק (שלב נלקח מהשורה הראשונה בקבוצה). */
export function groupCartLinesIntoOrders(lines: CartLineForOrder[]): OrderGroup[] {
  const bySupplier = new Map<string, CartLineForOrder[]>();
  for (const line of lines) {
    if (!line.supplierId) continue;
    const existing = bySupplier.get(line.supplierId) ?? [];
    existing.push(line);
    bySupplier.set(line.supplierId, existing);
  }

  return Array.from(bySupplier.entries()).map(([supplierId, groupLines]) => {
    const orderLines = groupLines.map((line) => toOrderLine(line));
    return {
      supplierId,
      phaseId: groupLines.find((l) => l.phaseId)?.phaseId ?? null,
      lines: orderLines,
      totalAmount: orderLines.reduce((sum, l) => sum + l.totalPrice, 0),
      sourceCartItemIds: groupLines.map((l) => l.id),
    };
  });
}

function toOrderLine(line: CartLineForOrder): OrderLine {
  const unitPrice = line.unitPrice ?? 0;
  return {
    description: line.description,
    quantity: line.quantity,
    unitPrice,
    totalPrice: Number((unitPrice * line.quantity).toFixed(2)),
  };
}

/** מספר הזמנה קריא: ORD-<תאריך קומפקטי><שעה/דקה/שנייה><אינדקס בתוך הבקשה>. */
export function generateOrderNumber(now: Date, indexInBatch: number): string {
  const stamp = now
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  return `ORD-${stamp}-${indexInBatch + 1}`;
}
