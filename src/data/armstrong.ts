import {
  HANGERS, type CalcInput, type CalcResult, type GrilyatoColor, type SpecRow,
} from "./grilyato";
import type { PriceMap } from "./prices";

/**
 * Формулы — из Google-таблицы «Армстронг» (лист «Армстронг», пример 2 × 6 м).
 * Контрольный пример: S=12, P=16 → плита 33,333 · несущая 3,7 м — 3 ·
 * поперечная 1,2 м — 17 · поперечная 0,6 м — 17 · угол — 6 · подвес — 9.
 *
 * Плита Армстронг            = S / 0,36 (в таблице без округления)
 * Несущая направляющая 3,7м  = ROUNDUP(S*0,83/3,7; 0)
 * Поперечная направляющая 1,2м = ROUNDUP(S*1,67/1,2; 0)
 * Поперечная направляющая 0,6м = ROUNDUP(S*0,83/0,6; 0)
 * Угол периметральный        = ROUNDUP(P/3; 0)
 * Подвес                     = ROUNDUP(S*0,7; 0)
 */

const ceil = Math.ceil;
const money = (v: number) => Math.round(v * 100) / 100;

/** Папка с иллюстрациями (путь без ведущего «/», чтобы работало на GitHub Pages). */
const IMG = "images/armstrong/";

/* ------------------------------- Плита ------------------------------- */

export interface ArmstrongTile {
  id: string;
  label: string;
  name: string;
  art: string;
  /** временная иллюстрация варианта (первое фото галереи) */
  image: string;
  /** галерея фото варианта; если не задана — используется одиночное image */
  gallery?: string[];
}

export const DEFAULT_ARMSTRONG_TILE: ArmstrongTile = {
  id: "white-aluminum",
  label: "Белый алюминий",
  name: "Потолочная панель AP600A6 Tegular/Т-24 белый алюминий",
  art: "12903346", image: `${IMG}tile-aluminum.webp`,
  gallery: [`${IMG}tile-aluminum-1.webp`, `${IMG}tile-aluminum-2.webp`],
};

// Product articles supplied for the six available tile variants.
export const ARMSTRONG_TILES: readonly ArmstrongTile[] = [
  {
    id: "pharaon", label: "Комплект Pharaon 24шт.",
    name: "Набор потолочных плит Pharaon 600x600 мм цвет белый 24 шт.",
    art: "89372764", image: `${IMG}tile-pharaon-1.webp`,
    gallery: [`${IMG}tile-pharaon-1.webp`, `${IMG}tile-pharaon-2.webp`],
  },
  {
    id: "baikal", label: "Комплект Байкал 20шт.",
    name: "Плита потолочная Knauf Armstrong Байкал 90RH Board 600x600x12 мм (в коробке 20 шт. 7.2 м2)",
    art: "82458369", image: `${IMG}tile-baikal-1.webp`,
    gallery: [`${IMG}tile-baikal-1.webp`, `${IMG}tile-baikal-2.webp`],
  },
  {
    id: "white-galvanized-steel", label: "Белая оцинкованная сталь",
    name: "Потолочная панель AP600A6 Tegular/Т-24 белая оцинкованная сталь",
    art: "84585955", image: `${IMG}tile-galvanized-steel-1.webp`,
    gallery: [`${IMG}tile-galvanized-steel-1.webp`, `${IMG}tile-galvanized-steel-2.webp`],
  },
  {
    id: "white-steel", label: "Белая сталь",
    name: "Потолочная панель AP600A6 Tegular/Т-24 белая сталь",
    art: "15143311", image: `${IMG}tile-white-steel-1.webp`,
    gallery: [`${IMG}tile-white-steel-1.webp`, `${IMG}tile-white-steel-2.webp`],
  },
  {
    id: "perforated-white", label: "Перфорированная белая",
    name: "Потолочная панель AP600A6 Tegular/Т-24 перф. белый",
    art: "12903354", image: `${IMG}tile-perforated-1.webp`,
    gallery: [`${IMG}tile-perforated-1.webp`, `${IMG}tile-perforated-2.webp`],
  },
  DEFAULT_ARMSTRONG_TILE,
];

export function getArmstrongTile(id: string): ArmstrongTile {
  return ARMSTRONG_TILES.find((tile) => tile.id === id) ?? DEFAULT_ARMSTRONG_TILE;
}

/* ------------------------------ Профиль ------------------------------ */

/** Т-профиль: артикулы трёх позиций (несущая 3,7 м и поперечные 1,2 и 0,6 м). Пустая строка — артикула нет. */
export interface ArmstrongProfile {
  id: string;
  label: string;
  arts: { main37: string; cross12: string; cross06: string };
  /** временная иллюстрация варианта */
  image: string;
}

export const ARMSTRONG_PROFILES: readonly ArmstrongProfile[] = [
  {
    id: "premium", label: "Премиум",
    arts: { main37: "15386313", cross12: "15386305", cross06: "15386292" },
    image: `${IMG}profile-premium.webp`,
  },
  {
    id: "economy", label: "Эконом",
    arts: { main37: "", cross12: "", cross06: "" },
    image: `${IMG}profile-economy.webp`,
  },
];

export const DEFAULT_ARMSTRONG_PROFILE: ArmstrongProfile = ARMSTRONG_PROFILES[0];

export function getArmstrongProfile(id: string): ArmstrongProfile {
  return ARMSTRONG_PROFILES.find((profile) => profile.id === id) ?? DEFAULT_ARMSTRONG_PROFILE;
}

/* -------------------------------- Угол -------------------------------- */

export interface ArmstrongAngle {
  id: string;
  label: string;
  name: string;
  art: string;
  /** временная иллюстрация варианта */
  image: string;
}

export const ARMSTRONG_ANGLES: readonly ArmstrongAngle[] = [
  {
    id: "steel", label: "Сталь",
    name: "Угол периметральный стальной 19x19x3000мм белый", art: "13452305",
    image: `${IMG}angle-steel.jpg`,
  },
  {
    id: "aluminum", label: "Алюминий",
    name: "Угол периметральный алюминиевый 19x19x3000мм белый", art: "",
    image: `${IMG}angle-aluminum.jpg`,
  },
];

export const DEFAULT_ARMSTRONG_ANGLE: ArmstrongAngle = ARMSTRONG_ANGLES[0];

export function getArmstrongAngle(id: string): ArmstrongAngle {
  return ARMSTRONG_ANGLES.find((angle) => angle.id === id) ?? DEFAULT_ARMSTRONG_ANGLE;
}

/* ------------------------------ Расчёт ------------------------------- */

/** цвет плитки — для совместимости с типом результата ColorName */
const TILE_COLOR: GrilyatoColor = { id: "white", name: "Белый", ral: "белый алюминий", hex: "#f2f2ef" };

export function calcArmstrong(
  input: CalcInput,
  prices: PriceMap,
  tileId = DEFAULT_ARMSTRONG_TILE.id,
  profileId = DEFAULT_ARMSTRONG_PROFILE.id,
  angleId = DEFAULT_ARMSTRONG_ANGLE.id,
): CalcResult {
  const tile = getArmstrongTile(tileId);
  const profile = getArmstrongProfile(profileId);
  const angle = getArmstrongAngle(angleId);
  const hanger = HANGERS.find((h) => h.len === input.hangerLen) ?? HANGERS[1];
  // запас, % — влияет на количество всего рассчитываемого товара
  const f = 1 + Math.min(50, Math.max(0, input.sparePct)) / 100;

  const area = input.length * input.width;
  const perimeter = 2 * input.length + 2 * input.width;

  const tiles = (area / 0.36) * f;
  const main37 = ceil((area * 0.83 * f) / 3.7);
  const cross12 = ceil((area * 1.67 * f) / 1.2);
  const cross06 = ceil((area * 0.83 * f) / 0.6);
  const angleQty = ceil((perimeter * f) / 3);
  const hangQty = ceil(area * 0.7 * f);

  const mk = (key: string, art: string, name: string, qty: number, unit: string): SpecRow => {
    const entry = art ? prices[art] : undefined;
    const p = entry?.price ?? 0;
    return { key, art, name, qty, unit, price: p, sum: money(qty * p), url: entry?.url, missing: !entry };
  };

  const rows: SpecRow[] = [
    mk("tile", tile.art, tile.name, tiles, "шт"),
    mk(
      "main37", profile.arts.main37,
      `Несущая направляющая 3,7 м — Т-профиль ${profile.label} 24x38x3700 мм цвет белый`,
      main37, "шт",
    ),
    mk(
      "cross12", profile.arts.cross12,
      `Поперечная направляющая 1,2 м — Т-профиль ${profile.label} 24x29x1200 мм цвет белый`,
      cross12, "шт",
    ),
    mk(
      "cross06", profile.arts.cross06,
      `Поперечная направляющая 0,6 м — Т-профиль ${profile.label} 24x29x600 мм цвет белый`,
      cross06, "шт",
    ),
    mk("angle", angle.art, angle.name, angleQty, "шт"),
    mk("hang", hanger.art, `Евро подвес L-${input.hangerLen}`, hangQty, "шт"),
  ];

  const total = money(rows.reduce((acc, r) => acc + r.sum, 0));

  return {
    area,
    perimeter,
    // «решётка» в карточке итогов для Армстронга — количество плит 600×600
    reshetka: tiles,
    rows,
    total,
    perM2: area > 0 ? total / area : 0,
    positions: rows.length,
    color: { ...TILE_COLOR, ral: tile.label },
    cell: {
      mm: 600,
      key: "100х100",
      label: "600×600",
      momFactor: 0,
      note: "Потолочная панель 600×600",
    },
    hanger,
    needs12: false,
  };
}
