// חישוב טהור (בלי DB) של פער הצעת מחיר מול אומדן הפרויקט - נבדק ב-gap-calculation.test.ts.

export type EstimateLine = {
  totalCost: number | null;
  materialCost: number | null;
  laborCost: number | null;
  transportCost: number | null;
};

/**
 * מסכם את שורות כתב הכמויות של הפרויקט לאומדן אחד. שורה עם totalCost משתמשת בו;
 * אחרת מחברים חומר+עבודה+הובלה (0 לשדה חסר). בלי שורות בכלל - אין אומדן (null),
 * לא 0 - כדי לא להטעות שהאומדן "אפס".
 */
export function sumEstimateLines(lines: EstimateLine[]): number | null {
  if (lines.length === 0) return null;
  return lines.reduce((sum, line) => sum + lineTotal(line), 0);
}

function lineTotal(line: EstimateLine): number {
  if (line.totalCost !== null) return line.totalCost;
  return (line.materialCost ?? 0) + (line.laborCost ?? 0) + (line.transportCost ?? 0);
}

/**
 * הפער בין מחיר ההצעה לאומדן: חיובי = ההצעה יקרה מהאומדן. בלי אומדן זמין - null
 * (מוצג כ"אין אומדן להשוואה", לא כ-0).
 */
export function calculateGapVsEstimate(price: number, estimateTotal: number | null): number | null {
  if (estimateTotal === null) return null;
  return price - estimateTotal;
}
