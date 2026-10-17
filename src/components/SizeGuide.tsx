import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import type { ReactNode } from "react";
import { CELL_SIZES } from "../data/grilyato";
import { cn } from "../utils/cn";

const ease = [0.22, 1, 0.36, 1] as const;

/** геометрия профиля Грильято */
const PROFILE_W = 10; // ширина полки профиля, мм
const PROFILE_H = 40; // высота профиля, мм
const MODULE = 600; // модуль кассеты, мм

/** коэффициенты на 1 м² — из формул Google-таблицы */
const MOM_PER_M2 = 2.78; // «мама»/«папа» = S × 2,78 × коэффициент ячейки
const HANGERS_PER_M2: Record<number, number> = { 50: 1.85, 75: 1.85, 100: 0.93 };

interface SizeInfo {
  mm: 100 | 75 | 50;
  kind: string;
  badge: string;
  featured?: boolean;
  lead: string;
  openLevel: string;
  maskLevel: string;
  frame: string;
  roomHeight: string;
  uses: string[];
}

const SIZES: SizeInfo[] = [
  {
    mm: 100,
    kind: "Крупная ячейка",
    badge: "Самый популярный",
    featured: true,
    lead: "Визуально «облегчает» потолок и даёт максимальный воздухообмен. Самый экономичный вариант по расходу профилей и подвесов.",
    openLevel: "высокая",
    maskLevel: "умеренная",
    frame: "2,4 + 1,2 + 0,6 м",
    roomHeight: "от 3,5 м",
    uses: ["Торговые залы", "Гипермаркеты", "Офисы open space", "Коридоры и холлы", "Вокзалы", "Паркинги"],
  },
  {
    mm: 75,
    kind: "Средняя ячейка",
    badge: "Универсальный баланс",
    lead: "Золотая середина: ритм решётки заметен, но не дробит пространство. Хорошо скрывает коммуникации и сохраняет воздухообмен.",
    openLevel: "средняя",
    maskLevel: "средняя",
    frame: "2,4 + 0,6 м",
    roomHeight: "от 3 м",
    uses: ["Офисы и переговорные", "Шоурумы", "Кафе и рестораны", "Фитнес-клубы", "Холлы ТРЦ", "Учебные заведения"],
  },
  {
    mm: 50,
    kind: "Мелкая ячейка",
    badge: "Максимальная маскировка",
    lead: "Плотная решётка с выраженной фактурой: лучше всех прячет инженерию и выглядит дороже. Требует больше профилей и подвесов.",
    openLevel: "умеренная",
    maskLevel: "высокая",
    frame: "2,4 + 0,6 м",
    roomHeight: "от 2,7 м",
    uses: ["Банки и офисы класса A", "Бутики", "Рестораны и бары", "Лобби гостиниц", "Низкие потолки", "Музеи и галереи"],
  },
];

/** все показатели считаются из геометрии, а не задаются вручную */
function metrics(mm: number) {
  const clear = mm - PROFILE_W;
  const openPct = Math.round((clear / mm) ** 2 * 100);
  const perSide = MODULE / mm;
  const momFactor = CELL_SIZES.find((c) => c.mm === mm)?.momFactor ?? 5;
  const baseFactor = CELL_SIZES.find((c) => c.mm === 100)?.momFactor ?? 5;
  return {
    clear,
    openPct,
    coverPct: 100 - openPct,
    perSide,
    cells: perSide * perSide,
    cellsM2: 1_000_000 / (mm * mm),
    profilesM2: 2 * MOM_PER_M2 * momFactor,
    ratio: momFactor / baseFactor,
    hangersM2: HANGERS_PER_M2[mm] ?? 0.93,
    /** угол от вертикали, начиная с которого просвет перекрывается высотой профиля */
    hideAngle: Math.round((Math.atan(clear / PROFILE_H) * 180) / Math.PI),
  };
}

const nf = (digits: number) => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: digits });

/* --------------------- фрагмент решётки в едином масштабе --------------------- */
function GridPreview({ mm, className }: { mm: number; className?: string }) {
  const W = 300;
  const H = 200;
  const half = PROFILE_W / 2;
  const offsetY = (H % mm) / 2;
  const xs: number[] = [];
  const ys: number[] = [];
  for (let x = 0; x <= W; x += mm) xs.push(x);
  for (let y = offsetY; y <= H; y += mm) ys.push(y);
  const id = `sg${mm}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-label={`Фрагмент решётки Грильято ${mm}×${mm} мм, вид снизу`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={`${id}-bg`} cx="50%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#3a454b" />
          <stop offset="100%" stopColor="#0e1214" />
        </radialGradient>
        <linearGradient id={`${id}-h`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbfcfd" />
          <stop offset="50%" stopColor="#d2d7dd" />
          <stop offset="100%" stopColor="#aab1b9" />
        </linearGradient>
        <linearGradient id={`${id}-v`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f8f9fb" />
          <stop offset="50%" stopColor="#d6dbe1" />
          <stop offset="100%" stopColor="#a5acb4" />
        </linearGradient>
      </defs>

      {/* пространство над потолком с коммуникациями */}
      <rect width={W} height={H} fill={`url(#${id}-bg)`} />
      <g opacity="0.6">
        <rect x="-10" y="46" width={W + 20} height="34" rx="6" fill="#56636a" />
        <rect x="-10" y="51" width={W + 20} height="4" fill="#71808a" />
        <line x1="-10" y1="128" x2={W + 10} y2="128" stroke="#a87a24" strokeWidth="5" strokeLinecap="round" />
        <line x1="-10" y1="148" x2={W + 10} y2="148" stroke="#4b585f" strokeWidth="9" strokeLinecap="round" />
      </g>

      {/* профили «мама» и «папа» */}
      {ys.map((y) => (
        <rect
          key={`h${y}`}
          x="0"
          y={y - half}
          width={W}
          height={PROFILE_W}
          fill={`url(#${id}-h)`}
          stroke="#4b535b"
          strokeWidth="0.6"
        />
      ))}
      {xs.map((x) => (
        <rect
          key={`v${x}`}
          x={x - half}
          y="0"
          width={PROFILE_W}
          height={H}
          fill={`url(#${id}-v)`}
          stroke="#4b535b"
          strokeWidth="0.6"
        />
      ))}
    </svg>
  );
}

/* ---------------------------------- карточка ---------------------------------- */
function SizeCard({ size, index }: { size: SizeInfo; index: number }) {
  const m = metrics(size.mm);
  const label = `${size.mm}×${size.mm}`;

  const ratio = m.ratio === 1 ? "база" : `×${nf(1).format(m.ratio)}`;

  const rows: [string, ReactNode][] = [
    ["Просвет ячейки", `${m.clear} мм`],
    [
      "Профилей «мама» + «папа»",
      <>
        ≈ {nf(0).format(m.profilesM2)} шт/м² <span className="font-semibold text-white/40">{ratio}</span>
      </>,
    ],
    ["Подвесов на 1 м²", `${nf(2).format(m.hangersM2)} шт`],
    ["Несущие направляющие", size.frame],
    ["Скрытие коммуникаций", `от ${m.hideAngle}° к вертикали`],
    ["Высота помещения", size.roomHeight],
  ];

  const pickSize = () => {
    window.dispatchEvent(new CustomEvent("grilyato:select-cell", { detail: size.mm }));
    document.getElementById("calc")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: index * 0.1, ease }}
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl border bg-white/[0.04] transition-all duration-300 hover:-translate-y-1",
        size.featured
          ? "border-pro/60 shadow-[0_24px_60px_rgba(255,203,5,0.08)]"
          : "border-white/10 hover:border-pro/50"
      )}
    >
      {/* превью */}
      <div className="relative">
        <GridPreview mm={size.mm} className="block aspect-[3/2] w-full" />
        <span
          className={cn(
            "absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide",
            size.featured ? "bg-pro text-graphite" : "border border-white/15 bg-graphite/80 text-white backdrop-blur"
          )}
        >
          {size.badge}
        </span>
        <span className="absolute bottom-3 right-3 rounded-md bg-black/55 px-2 py-1 text-[10.5px] font-semibold text-white/75 backdrop-blur">
          фрагмент 300×200 мм
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="text-[34px] font-black leading-none tracking-[-0.02em] tabular">{label}</h4>
          <span className="text-[12.5px] font-bold text-white/50">просвет {m.clear} мм</span>
        </div>
        <div className="mt-2 text-[12px] font-extrabold uppercase tracking-[0.16em] text-pro">{size.kind}</div>
        <p className="mt-3 text-[13.5px] leading-relaxed text-white/60">{size.lead}</p>

        {/* ключевые показатели */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/45">
              <Eye size={13} strokeWidth={2.4} /> Прозрачность
            </div>
            <div className="mt-1 text-[28px] font-black leading-none tabular">{m.openPct}%</div>
            <div className="mt-1 text-[11.5px] font-semibold text-white/45">{size.openLevel}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/45">
              <EyeOff size={13} strokeWidth={2.4} /> Маскировка
            </div>
            <div className="mt-1 text-[28px] font-black leading-none text-pro tabular">{m.coverPct}%</div>
            <div className="mt-1 text-[11.5px] font-semibold text-white/45">плотность {size.maskLevel}</div>
          </div>
        </div>

        {/* соотношение профиль / просвет */}
        <div className="mt-4">
          <div className="flex h-2.5 overflow-hidden rounded-full bg-white/15">
            <motion.div
              className="h-full bg-pro"
              initial={{ width: 0 }}
              whileInView={{ width: `${m.coverPct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 + index * 0.1, ease }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[11px] font-semibold text-white/45">
            <span>профиль {m.coverPct}%</span>
            <span>просвет {m.openPct}%</span>
          </div>
        </div>

        {/* характеристики */}
        <dl className="mt-5 divide-y divide-white/10 border-y border-white/10 text-[13px]">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-3 py-2.5">
              <dt className="text-white/55">{k}</dt>
              <dd className="text-right font-bold tabular">{v}</dd>
            </div>
          ))}
        </dl>

        {/* где используется */}
        <div className="mt-5">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-white/45">Где используется</div>
          <div className="flex flex-wrap gap-1.5">
            {size.uses.map((u) => (
              <span
                key={u}
                className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11.5px] font-semibold text-white/80"
              >
                {u}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={pickSize}
          className="mt-auto inline-flex items-center gap-2 pt-6 text-[13.5px] font-extrabold text-pro transition-all hover:gap-3"
        >
          Рассчитать с ячейкой {label}
          <ArrowRight size={15} strokeWidth={2.6} />
        </button>
      </div>
    </motion.article>
  );
}

/* ------------------------------------ блок ------------------------------------ */
export function SizeGuide() {
  return (
    <div id="sizes" className="mt-16 scroll-mt-[130px] lg:mt-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease }}
        className="mb-8"
      >
        <div className="mb-2 text-[12.5px] font-extrabold uppercase tracking-[0.18em] text-pro">
          Типоразмеры ячейки
        </div>
        <h3 className="text-[30px] font-black leading-[1.05] tracking-[-0.01em] lg:text-[42px]">
          Подробно о каждом типоразмере
        </h3>
        <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-white/55">
          Фрагменты решётки показаны в одном масштабе — сравните плотность ячейки.
        </p>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        {SIZES.map((size, i) => (
          <SizeCard key={size.mm} size={size} index={i} />
        ))}
      </div>

    </div>
  );
}

export default SizeGuide;
