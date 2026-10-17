import type { CalcInput } from "../data/grilyato";

const KEY = "grilyato:last-input";

export const DEFAULT_INPUT: CalcInput = {
  length: 2.4,
  width: 6,
  cellMm: 50,
  colorId: "black",
  hangerLen: 275,
  sparePct: 5,
};

/** Сохраняет параметры расчёта, чтобы страница «Смета» открылась с теми же данными. */
export function saveCalcInput(input: CalcInput): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(input));
  } catch {
    /* приватный режим — просто пропускаем */
  }
}

/** Читает сохранённые параметры расчёта; при отсутствии — значения по умолчанию. */
export function loadCalcInput(): CalcInput {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_INPUT;
    const parsed = JSON.parse(raw) as Partial<CalcInput>;
    const num = (v: unknown, fallback: number) =>
      typeof v === "number" && Number.isFinite(v) && v > 0 ? v : fallback;
    return {
      length: num(parsed.length, DEFAULT_INPUT.length),
      width: num(parsed.width, DEFAULT_INPUT.width),
      cellMm: [50, 75, 100].includes(Number(parsed.cellMm)) ? Number(parsed.cellMm) : DEFAULT_INPUT.cellMm,
      colorId: ["black", "white", "metal"].includes(String(parsed.colorId))
        ? String(parsed.colorId)
        : DEFAULT_INPUT.colorId,
      hangerLen: [275, 500, 1000, 1500].includes(Number(parsed.hangerLen))
        ? Number(parsed.hangerLen)
        : DEFAULT_INPUT.hangerLen,
      sparePct:
        typeof parsed.sparePct === "number" && parsed.sparePct >= 0 && parsed.sparePct <= 50
          ? parsed.sparePct
          : DEFAULT_INPUT.sparePct,
    };
  } catch {
    return DEFAULT_INPUT;
  }
}
