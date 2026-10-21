import type { CalcInput } from "../data/grilyato";

const KEY = "grilyato:last-input";
const ARMSTRONG_KEY = "armstrong:last-setup";

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

/** Приводит прочитанные из памяти браузера данные к корректным параметрам расчёта. */
function sanitizeInput(parsed: Partial<CalcInput>): CalcInput {
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
}

/** Читает сохранённые параметры расчёта; при отсутствии — значения по умолчанию. */
export function loadCalcInput(): CalcInput {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_INPUT;
    return sanitizeInput(JSON.parse(raw) as Partial<CalcInput>);
  } catch {
    return DEFAULT_INPUT;
  }
}

/* ----------------------------- Армстронг ----------------------------- */

/** Параметры расчёта Армстронга: размеры помещения + выбранные комплектующие. */
export interface ArmstrongSetup {
  input: CalcInput;
  tileId: string;
  profileId: string;
  angleId: string;
}

export const DEFAULT_ARMSTRONG_SETUP: ArmstrongSetup = {
  input: DEFAULT_INPUT,
  tileId: "white-aluminum",
  profileId: "premium",
  angleId: "steel",
};

/**
 * Сохраняет расчёт Армстронга, чтобы страница
 * «Спецификация материалов Армстронг» открылась с теми же материалами.
 */
export function saveArmstrongSetup(setup: ArmstrongSetup): void {
  try {
    localStorage.setItem(ARMSTRONG_KEY, JSON.stringify(setup));
  } catch {
    /* приватный режим — просто пропускаем */
  }
}

/** Читает сохранённый расчёт Армстронга; при отсутствии — значения по умолчанию. */
export function loadArmstrongSetup(): ArmstrongSetup {
  try {
    const raw = localStorage.getItem(ARMSTRONG_KEY);
    if (!raw) return DEFAULT_ARMSTRONG_SETUP;
    const parsed = JSON.parse(raw) as Partial<ArmstrongSetup>;
    const str = (v: unknown, fallback: string) =>
      typeof v === "string" && v.trim() ? v : fallback;
    return {
      input: sanitizeInput((parsed.input ?? {}) as Partial<CalcInput>),
      tileId: str(parsed.tileId, DEFAULT_ARMSTRONG_SETUP.tileId),
      profileId: str(parsed.profileId, DEFAULT_ARMSTRONG_SETUP.profileId),
      angleId: str(parsed.angleId, DEFAULT_ARMSTRONG_SETUP.angleId),
    };
  } catch {
    return DEFAULT_ARMSTRONG_SETUP;
  }
}
