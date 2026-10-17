/**
 * Данные и формулы — ровно из Google-таблицы Лемана Про Челябинск.
 *
 * Площадь      S = C2 * C3
 * Периметр     P = C2*2 + C3*2
 * Решетка 60х60      = ROUNDUP(S*2,78; 1)
 * «мама»/«папа»      = ROUNDUP(S*2,78 * IFS(50х50→11; 75х75→7; 100х100→5); 0)
 * Направляющая 2,4м  = ROUNDUP(S * IFS(50х50→0,7; 75х75→0,7; 100х100→0,35); 0)
 * Направляющая 1,2м  = ROUNDUP(S * IFS(50х50→0; 75х75→0; 100х100→1,39); 0)
 *                      (для 50х50 и 75х75 — «Не требуется»)
 * Направляющая 0,6м  = ROUNDUP(S * IFS(50х50→2,78; 75х75→2,78; 100х100→1,39); 0)
 * Соединитель        = ROUNDUP(S * IFS(50х50→0,7; 75х75→0,7; 100х100→0,35); 0) — 82151813
 * Подвес             = ROUNDUP(S * IFS(50х50→1,85; 75х75→1,85; 100х100→0,93); 0)
 * Угол PL19х24       = ROUNDUP(P/3; 0)
 *
 * Контрольный пример листа (5 × 4,2 м, 100х100, Черный): решётка 58,4 · мама 292 ·
 * папа 292 · напр. 2,4 — 8 · 1,2 — 30 · 0,6 — 30 · соединитель 8 · подвес 20 · угол 7.
 */

import type { PriceMap } from "./prices";

export type CellKey = "50х50" | "75х75" | "100х100";
export type ColorName = "Черный" | "Белый" | "Металлик";

export interface CellSize {
  mm: number;
  key: CellKey;
  label: string;
  /** множитель профилей «мама»/«папа» из формулы IFS */
  momFactor: number;
  note: string;
}

export const CELL_SIZES: CellSize[] = [
  { mm: 50, key: "50х50", label: "50×50", momFactor: 11, note: "11 «мам» и 11 «пап» на блок 590×590" },
  { mm: 75, key: "75х75", label: "75×75", momFactor: 7, note: "7 «мам» и 7 «пап» на блок 590×590" },
  { mm: 100, key: "100х100", label: "100×100", momFactor: 5, note: "5 «мам» и 5 «пап» на блок 590×590" },
];

export interface GrilyatoColor {
  id: "black" | "white" | "metal";
  name: ColorName;
  ral: string;
  hex: string;
}

export const COLORS: GrilyatoColor[] = [
  { id: "black", name: "Черный", ral: "RAL 9005", hex: "#1b1b1c" },
  { id: "white", name: "Белый", ral: "RAL 9003", hex: "#f2f2ef" },
  { id: "metal", name: "Металлик", ral: "металлик", hex: "#c9cdd2" },
];

export interface HangerOption {
  len: number;
  art: string;
  name: string;
}

export const HANGERS: HangerOption[] = [
  { len: 275, art: "12903338", name: "Евро подвес L-275" },
  { len: 500, art: "82936530", name: "Евро подвес L-500" },
  { len: 1000, art: "82936531", name: "Евро подвес L-1000" },
  { len: 1500, art: "82936532", name: "Евро подвес L-1500" },
];

const CONNECTOR = { art: "82151813", name: "Профиль соединительный H50 b10 (мет.)" };

/** артикулы угла PL19х24 по цвету (одинаковы для всех ячеек) */
const ANGLE_ART: Record<ColorName, string> = {
  Черный: "82936536",
  Белый: "82936537",
  Металлик: "82936535",
};

/** точная матрица артикулов из формул таблицы */
const ART: {
  mom: Record<CellKey, Record<ColorName, string>>;
  dad: Record<CellKey, Record<ColorName, string>>;
  g24: Record<CellKey, Record<ColorName, string>>;
  g12: Partial<Record<CellKey, Record<ColorName, string>>>;
  g06: Record<CellKey, Record<ColorName, string>>;
} = {
  mom: {
    "50х50": { Белый: "82151718", Металлик: "82151722", Черный: "82151726" },
    "75х75": { Белый: "82151742", Металлик: "82151746", Черный: "82151750" },
    "100х100": { Белый: "82151769", Металлик: "82151774", Черный: "82151779" },
  },
  dad: {
    "50х50": { Белый: "82151719", Металлик: "82151723", Черный: "82151727" },
    "75х75": { Белый: "82151743", Металлик: "82151747", Черный: "82151751" },
    "100х100": { Белый: "82151770", Металлик: "82151775", Черный: "82151780" },
  },
  g24: {
    "50х50": { Белый: "82151720", Металлик: "82151724", Черный: "82151728" },
    "75х75": { Белый: "82151744", Металлик: "82151748", Черный: "82151752" },
    "100х100": { Белый: "82151772", Металлик: "82151777", Черный: "82151782" },
  },
  g12: {
    // для 50х50 и 75х75 — «Не требуется»
    "100х100": { Белый: "82151771", Металлик: "82151776", Черный: "82151781" },
  },
  g06: {
    "50х50": { Белый: "82151717", Металлик: "82151721", Черный: "82151725" },
    "75х75": { Белый: "82151741", Металлик: "82151745", Черный: "82151749" },
    "100х100": { Белый: "82151768", Металлик: "82151773", Черный: "82151778" },
  },
};

export interface CalcInput {
  length: number; // м
  width: number; // м
  cellMm: number; // 50 | 75 | 100
  colorId: string; // black | white | metal
  hangerLen: number; // 275 | 500 | 1000 | 1500
  sparePct: number; // запас, % — влияет на все позиции расчёта
}

export interface SpecRow {
  key: string;
  art: string;
  name: string;
  qty: number;
  unit: string;
  /** цена из таблицы по артикулу, ₽ */
  price: number;
  sum: number;
  /** ссылка на товар на lemanapro.ru (из столбца C таблицы) */
  url?: string;
  /** артикула нет в таблице цен */
  missing: boolean;
}

export interface CalcResult {
  area: number;
  perimeter: number;
  /** решётка 600×600, шт (ROUNDUP до 0,1) */
  reshetka: number;
  rows: SpecRow[];
  total: number;
  perM2: number;
  positions: number;
  color: GrilyatoColor;
  cell: CellSize;
  hanger: HangerOption;
  /** направляющая 1,2 м требуется только для ячейки 100×100 */
  needs12: boolean;
}

const ceil = Math.ceil;
const ceil1 = (v: number) => ceil(v * 10) / 10;

const money = (v: number) => Math.round(v * 100) / 100;

export function calcGrilyato(input: CalcInput, prices: PriceMap): CalcResult {
  const color = COLORS.find((c) => c.id === input.colorId) ?? COLORS[0];
  const cell = CELL_SIZES.find((c) => c.mm === input.cellMm) ?? CELL_SIZES[2];
  const hanger = HANGERS.find((h) => h.len === input.hangerLen) ?? HANGERS[1];
  // запас, % — влияет на количество всего рассчитываемого товара
  const f = 1 + Math.min(50, Math.max(0, input.sparePct)) / 100;

  // S и P — формулы C2*C3 и C2*2+C3*2
  const area = input.length * input.width;
  const perimeter = 2 * input.length + 2 * input.width;

  // решётка 60х60 = ROUNDUP(S*2,78; 1)
  const reshetka = ceil1(area * 2.78 * f);

  const is100 = cell.mm === 100;
  const g24Factor = is100 ? 0.35 : 0.7;
  const g06Factor = is100 ? 1.39 : 2.78;
  const hangFactor = is100 ? 0.93 : 1.85;

  const momQty = ceil(area * 2.78 * cell.momFactor * f);
  const g24Qty = ceil(area * g24Factor * f);
  const g12Qty = is100 ? ceil(area * 1.39 * f) : 0;
  const g06Qty = ceil(area * g06Factor * f);
  const connQty = ceil(area * g24Factor * f);
  const hangQty = ceil(area * hangFactor * f);
  const angleQty = ceil((perimeter / 3) * f);

  const N = color.name;
  const sizeTxt = `${cell.key}мм. цвет ${N}`;
  // цена и ссылка берутся из таблицы по артикулу (столбец A → B, C)
  const mk = (key: string, art: string, name: string, qty: number, unit: string): SpecRow => {
    const entry = prices[art];
    const p = entry?.price ?? 0;
    return { key, art, name, qty, unit, price: p, sum: money(qty * p), url: entry?.url, missing: !entry };
  };

  const rows: SpecRow[] = [
    mk("mom", ART.mom[cell.key][N], `Grigliato «мама» ${sizeTxt}`, momQty, "шт"),
    mk("dad", ART.dad[cell.key][N], `Grigliato «папа» ${sizeTxt}`, momQty, "шт"),
    mk("g24", ART.g24[cell.key][N], `Grigliato Несущая направляющая 2,4 м ${sizeTxt}`, g24Qty, "шт"),
  ];
  if (g12Qty > 0) {
    rows.push(
      mk("g12", ART.g12[cell.key]![N], `Grigliato Несущая направляющая 1,2 м ${sizeTxt}`, g12Qty, "шт"),
    );
  }
  rows.push(
    mk("g06", ART.g06[cell.key][N], `Grigliato Несущая направляющая 0,6 м ${sizeTxt}`, g06Qty, "шт"),
    mk("conn", CONNECTOR.art, CONNECTOR.name, connQty, "шт"),
    mk("hang", hanger.art, hanger.name, hangQty, "шт"),
    mk("angle", ANGLE_ART[N], `Угол PL19х24 ${N}`, angleQty, "шт"),
  );

  const total = money(rows.reduce((acc, r) => acc + r.sum, 0));

  return {
    area,
    perimeter,
    reshetka,
    rows,
    total,
    perM2: area > 0 ? total / area : 0,
    positions: rows.length,
    color,
    cell,
    hanger,
    needs12: is100,
  };
}

export const fmt = new Intl.NumberFormat("ru-RU");
export const fmtMoney = (v: number) => `${fmt.format(Math.round(v))} ₽`;
/** цена за единицу: до 2 знаков после запятой (13,9 ₽) */
export const fmtPrice = (v: number) =>
  new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(v);
export const fmt1 = (v: number) =>
  new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(v);

export const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/16SWWagWF6RLSaoCezFa2J09J1n-RPQ4QDG3b8SpubZg/edit?usp=drivesdk";

export const STORE = {
  city: "Челябинск",
  address: "Копейское шоссе, 64",
  fullAddress: "Челябинск, Копейское шоссе, 64",
  hours: "ежедневно 08:00–22:00",
};
