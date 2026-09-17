import { describe, expect, it } from "vitest";
import { movePhaseOrder } from "./scheduling";

const phases = [
  { id: "a", order: 0 },
  { id: "b", order: 1 },
  { id: "c", order: 2 },
];

describe("movePhaseOrder", () => {
  it("מזיזה שלב אמצעי למעלה - מתחלף עם השכן שלפניו", () => {
    const result = movePhaseOrder(phases, "b", "up");
    expect(result.find((p) => p.id === "b")?.order).toBe(0);
    expect(result.find((p) => p.id === "a")?.order).toBe(1);
  });

  it("מזיזה שלב אמצעי למטה - מתחלף עם השכן שאחריו", () => {
    const result = movePhaseOrder(phases, "b", "down");
    expect(result.find((p) => p.id === "b")?.order).toBe(2);
    expect(result.find((p) => p.id === "c")?.order).toBe(1);
  });

  it("לא משנה כלום כשמנסים להזיז את הראשון למעלה", () => {
    const result = movePhaseOrder(phases, "a", "up");
    expect(result).toEqual(phases);
  });

  it("לא משנה כלום כשמנסים להזיז את האחרון למטה", () => {
    const result = movePhaseOrder(phases, "c", "down");
    expect(result).toEqual(phases);
  });

  it("מחזירה את הרשימה כמות שהיא אם השלב לא נמצא", () => {
    const result = movePhaseOrder(phases, "missing", "up");
    expect(result).toBe(phases);
  });
});
