// עזר טהור משותף לטפסי השלב/משימה - ממיר Date לערך input[type=date] (YYYY-MM-DD).
export function toDateInput(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}
