import { useEffect, useMemo, useState } from "react";
import { motion, useMotionValueEvent, useSpring } from "framer-motion";
import {
  Download, Info, MoveVertical, Palette,
  PackagePlus, Ruler, SquarePen, FileSpreadsheet, ExternalLink,
  RefreshCw, WifiOff, TriangleAlert, Printer, LayoutGrid, CornerDownRight,
  ChevronLeft, ChevronRight, Maximize2, X,
} from "lucide-react";
import {
  CELL_SIZES, COLORS, HANGERS,
  calcGrilyato, fmt, fmt1, fmtMoney, fmtPrice, type CalcInput,
} from "../data/grilyato";
import { PRICE_SHEET_URL, REFRESH_MS, usePrices, type PriceStatus } from "../data/prices";
import {
  ARMSTRONG_ANGLES, ARMSTRONG_PROFILES, ARMSTRONG_TILES,
  DEFAULT_ARMSTRONG_ANGLE, DEFAULT_ARMSTRONG_PROFILE, DEFAULT_ARMSTRONG_TILE,
  calcArmstrong, getArmstrongAngle, getArmstrongProfile, getArmstrongTile,
} from "../data/armstrong";
import { CellScheme } from "./CellScheme";
import PlanPreview from "./PlanPreview";
import { printSpec } from "../utils/printSpec";
import { loadCalcInput, saveCalcInput } from "../utils/calcStorage";
import { cn } from "../utils/cn";

/* -------------------------- Unbounded dimension field -------------------------- */
function DimensionField(props: {
  label: string; value: number; unit: string; onChange: (v: number) => void;
}) {
  const { label, value, unit, onChange } = props;
  const [text, setText] = useState(String(value).replace(".", ","));
  useEffect(() => setText(String(value).replace(".", ",")), [value]);

  const commit = (raw: string) => {
    setText(raw);
    const v = parseFloat(raw.replace(",", "."));
    if (Number.isFinite(v) && v > 0) onChange(v);
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <label className="text-[13px] font-bold text-graphite/70 flex items-center gap-1.5">
          <Ruler size={14} strokeWidth={2.4} className="text-graphite/40" />
          {label}
        </label>
        <div className="flex items-baseline gap-1">
          <input
            value={text}
            onChange={(e) => commit(e.target.value)}
            onBlur={() => setText(String(value).replace(".", ","))}
            inputMode="decimal"
            aria-label={label}
            className="no-spin w-[120px] text-right text-[17px] font-extrabold bg-smoke rounded-lg px-2 py-1 outline-none border border-transparent focus:border-pro transition-colors tabular"
          />
          <span className="text-[13px] font-semibold text-graphite/50">{unit}</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Price status ------------------------------ */
function PriceStatusBar(props: {
  status: PriceStatus; updatedAt: Date | null; refreshing: boolean;
  changed: number; onRefresh: () => void;
}) {
  const { status, updatedAt, refreshing, changed, onRefresh } = props;
  const time = updatedAt?.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const live = status === "live";
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 lg:px-5 py-2.5 border-b text-[12.5px] font-semibold",
        live ? "bg-emerald-50/70 border-emerald-100 text-emerald-900"
          : status === "loading" ? "bg-smoke border-line text-graphite/70"
          : "bg-amber-50 border-amber-100 text-amber-900"
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        {live ? (
          <span className="relative flex w-2.5 h-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 animate-ping" />
            <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </span>
        ) : status === "loading" ? (
          <RefreshCw size={13} strokeWidth={2.6} className="animate-spin shrink-0" />
        ) : (
          <WifiOff size={14} strokeWidth={2.4} className="shrink-0" />
        )}
        <span className="truncate">
          {live && <>Цены обновлены в {time}</>}
          {status === "loading" && <>Обновляем цены…</>}
          {status === "offline" && <>Не удалось обновить цены — показаны сохранённые</>}
        </span>
        {live && changed > 0 && (
          <span className="shrink-0 rounded-full bg-pro text-graphite px-2 py-0.5 text-[11px] font-extrabold">
            изменилось цен: {changed}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden md:inline text-[11.5px] opacity-60">авто-обновление каждые {REFRESH_MS / 1000} с</span>
        <a href={PRICE_SHEET_URL} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1 underline-offset-2 hover:underline opacity-80 hover:opacity-100">
          Таблица цен <ExternalLink size={11} strokeWidth={2.6} />
        </a>
        <button
          onClick={onRefresh} disabled={refreshing}
          className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-current/20 bg-white/70 hover:bg-white transition-colors disabled:opacity-60"
        >
          <RefreshCw size={12} strokeWidth={2.7} className={refreshing ? "animate-spin" : ""} />
          Обновить
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ Part image ------------------------------ */
/**
 * Блок с иллюстрацией выбранного варианта комплектующего (плита / профиль / угол).
 * Если фото несколько — под изображением появляются стрелки листания,
 * клик по фото открывает его на весь экран.
 */
function PartImage({ images, caption, label }: { images: string[]; caption: string; label: string }) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const total = Math.max(images.length, 1);
  const safeIndex = ((index % total) + total) % total;
  const src = images[safeIndex] ?? images[0];

  // при смене варианта — вернуться к первому фото
  useEffect(() => {
    setIndex(0);
    setZoomed(false);
  }, [images.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  // Esc и стрелки в полноэкранном режиме
  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomed, total]);

  const showArrows = total > 1;

  return (
    <>
      <div className="mt-3 overflow-hidden rounded-xl border border-line bg-white">
        <button
          type="button"
          onClick={() => setZoomed(true)}
          title="Открыть на весь экран"
          aria-label={`Открыть фото на весь экран: ${label}`}
          className="group relative block w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-pro"
        >
          <img
            key={src}
            src={src}
            alt={`${caption}: ${label} — фото ${safeIndex + 1} из ${total}`}
            loading="lazy"
            className="block aspect-[800/420] w-full object-cover animate-scheme-in"
          />
          <span className="pointer-events-none absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-lg bg-white/90 text-graphite/60 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
            <Maximize2 size={14} strokeWidth={2.2} />
          </span>
        </button>

        {/* стрелки перелистывания под изображением */}
        {showArrows && (
          <div className="flex items-center justify-between gap-2 border-t border-line bg-white px-2 py-1.5">
            <button
              type="button"
              onClick={prev}
              aria-label="Предыдущее фото"
              className="grid h-8 w-10 place-items-center rounded-lg border border-line text-graphite/70 transition-colors hover:border-graphite/50 hover:bg-smoke"
            >
              <ChevronLeft size={16} strokeWidth={2.4} />
            </button>
            <span className="text-[12px] font-bold tabular-nums text-graphite/55" aria-live="polite">
              {safeIndex + 1} / {total}
            </span>
            <button
              type="button"
              onClick={next}
              aria-label="Следующее фото"
              className="grid h-8 w-10 place-items-center rounded-lg border border-line text-graphite/70 transition-colors hover:border-graphite/50 hover:bg-smoke"
            >
              <ChevronRight size={16} strokeWidth={2.4} />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-line bg-smoke px-3 py-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-graphite/45">{caption}</span>
          <span className="text-right text-[12px] font-extrabold text-graphite">{label}</span>
        </div>
      </div>

      {/* полноэкранный просмотр */}
      {zoomed && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-graphite/95 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Фото на весь экран: ${label}`}
          onClick={() => setZoomed(false)}
        >
          <div className="flex items-center justify-between gap-4 text-white">
            <div className="text-[13px] font-bold">
              {label} <span className="text-white/50 tabular-nums">· {safeIndex + 1} / {total}</span>
            </div>
            <button
              type="button"
              onClick={() => setZoomed(false)}
              aria-label="Закрыть"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/15 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={20} strokeWidth={2.2} />
            </button>
          </div>
          <div
            className="mt-3 flex min-h-0 flex-1 items-center justify-center gap-2 sm:gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {showArrows && (
              <button
                type="button"
                onClick={prev}
                aria-label="Предыдущее фото"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/15 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ChevronLeft size={22} strokeWidth={2.2} />
              </button>
            )}
            <img
              key={src}
              src={src}
              alt={`${caption}: ${label} — фото ${safeIndex + 1} из ${total}`}
              className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
            />
            {showArrows && (
              <button
                type="button"
                onClick={next}
                aria-label="Следующее фото"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/15 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ChevronRight size={22} strokeWidth={2.2} />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------ Calculator ------------------------------ */
export default function Calculator({
  showPlan = true,
  showTableTotal = true,
  printHref,
  mode = "grilyato",
}: {
  /** показывать блок «План потолка · вид сверху» */
  showPlan?: boolean;
  /** показывать строку «Итого по смете» в подвале таблицы спецификации */
  showTableTotal?: boolean;
  /** если задан — кнопка «Печать» становится ссылкой на эту страницу */
  printHref?: string;
  /** система потолка: grilyato — по формулам Грильято, armstrong — по таблице «Армстронг» */
  mode?: "grilyato" | "armstrong";
} = {}) {
  const armstrong = mode === "armstrong";
  const { prices, status, updatedAt, refreshing, refresh, changed } = usePrices();
  const [input, setInput] = useState<CalcInput>(() => loadCalcInput());
  const [tileId, setTileId] = useState(DEFAULT_ARMSTRONG_TILE.id);
  const [profileId, setProfileId] = useState(DEFAULT_ARMSTRONG_PROFILE.id);
  const [angleId, setAngleId] = useState(DEFAULT_ARMSTRONG_ANGLE.id);
  const selectedTile = getArmstrongTile(tileId);
  const selectedProfile = getArmstrongProfile(profileId);
  const selectedAngle = getArmstrongAngle(angleId);
  const res = useMemo(
    () => (armstrong
      ? calcArmstrong(input, prices, tileId, profileId, angleId)
      : calcGrilyato(input, prices)),
    [armstrong, input, prices, tileId, profileId, angleId],
  );
  const missingCount = res.rows.filter((r) => r.missing).length;
  const decimal = (v: number) => String(v).replace(".", ",");

  const spring = useSpring(res.total, { stiffness: 90, damping: 20, mass: 0.6 });
  const [totalShown, setTotalShown] = useState(res.total);
  useEffect(() => { spring.set(res.total); }, [res.total, spring]);
  useMotionValueEvent(spring, "change", (v) => setTotalShown(Math.round(v)));

  const set = <K extends keyof CalcInput>(k: K, v: CalcInput[K]) =>
    setInput((p) => ({ ...p, [k]: v }));

  // параметры доступны странице «Смета»
  useEffect(() => {
    if (!armstrong) saveCalcInput(input);
  }, [input, armstrong]);

  // выбор ячейки из блока «Подробно о каждом типоразмере»
  useEffect(() => {
    const onSelect = (e: Event) => {
      const mm = (e as CustomEvent<number>).detail;
      if (CELL_SIZES.some((c) => c.mm === mm)) setInput((p) => ({ ...p, cellMm: mm }));
    };
    window.addEventListener("grilyato:select-cell", onSelect);
    return () => window.removeEventListener("grilyato:select-cell", onSelect);
  }, []);

  const csvText = useMemo(() => {
    const head = [
      armstrong ? "Спецификация материалов Армстронг" : `Лемана Про Челябинск — Смета на потолок Грильято`,
      `Помещение;${fmt1(input.length)} x ${fmt1(input.width)} м;S = ${fmt1(res.area)} м2;P = ${fmt1(res.perimeter)} м`,
      armstrong
        ? `Плита;${selectedTile.label};Профиль;${selectedProfile.label};Угол;${selectedAngle.label};Подвес;${res.hanger.name};Запас;${input.sparePct}%`
        : `Ячейка;${res.cell.key} мм;Цвет;${res.color.name};Подвес;${res.hanger.name};Запас;${input.sparePct}%`,
      ``,
      `Артикул;Наименование;Кол-во;Ед.;Цена;Сумма`,
      ...res.rows.map((r) => `${r.art};${r.name};${r.qty};${r.unit};${armstrong && r.missing ? "нет цены;нет цены" : `${decimal(r.price)};${decimal(r.sum)}`}`),
      `;;;;ИТОГО;${decimal(res.total)}`,
    ];
    return "\uFEFF" + head.join("\r\n");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [res, input, armstrong, selectedTile]);

  const downloadCsv = () => {
    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = armstrong
      ? `smeta-armstrong-${fmt1(input.length)}x${fmt1(input.width)}m.csv`
      : `smeta-grilyato-${fmt1(input.length)}x${fmt1(input.width)}m-${input.cellMm}mm.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const [printMessage, setPrintMessage] = useState("");

  const handlePrint = () => {
    const ok = printSpec({ input, result: res, mode });
    setPrintMessage(ok ? "Документ открыт для печати" : "Браузер заблокировал окно печати");
    window.setTimeout(() => setPrintMessage(""), 2500);
  };

  return (
    <section id="calc" className="relative bg-smoke py-14 lg:py-20 scroll-mt-[130px]">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-end justify-between gap-4 mb-8"
        >
          <div>
            <div className="text-[12.5px] font-extrabold tracking-[0.18em] uppercase text-graphite/45 mb-2">
              {armstrong ? "Калькулятор · Армстронг" : "Калькулятор · Grigliato"}
            </div>
            <h2 className="text-[32px] lg:text-[46px] font-black leading-[1.02] tracking-[-0.01em]">
              Соберите свой потолок
            </h2>
          </div>
          <div className="flex items-center gap-2 text-[13px] font-semibold text-graphite/55">
            <Info size={15} strokeWidth={2.3} className="text-graphite/40" />
            Пересчёт мгновенный — меняйте параметры
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[400px_minmax(0,1fr)] xl:grid-cols-[440px_minmax(0,1fr)] gap-5 items-start">
          {/* -------- inputs -------- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl bg-white border border-line p-5 lg:p-6 shadow-[0_2px_20px_rgba(20,25,27,0.05)] space-y-7"
          >
            <div className="space-y-5">
              <DimensionField label="Длина помещения" unit="м"
                value={input.length} onChange={(v) => set("length", v)} />
              <DimensionField label="Ширина помещения" unit="м"
                value={input.width} onChange={(v) => set("width", v)} />
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-smoke px-3.5 py-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-graphite/45">Площадь</div>
                  <div className="text-[19px] font-black tabular">{fmt1(res.area)} м²</div>
                </div>
                <div className="rounded-xl bg-smoke px-3.5 py-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-graphite/45">Периметр</div>
                  <div className="text-[19px] font-black tabular">{fmt1(res.perimeter)} м</div>
                </div>
              </div>
            </div>

            {/* armstrong: комплектующие из таблицы */}
            {armstrong ? (
              <div className="space-y-5">
                {/* плита */}
                <div>
                  <div className="text-[12.5px] font-bold text-graphite/60 mb-2 flex items-center gap-1.5">
                    <LayoutGrid size={14} strokeWidth={2.2} className="text-graphite/40" aria-hidden="true" />
                    Плита
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {ARMSTRONG_TILES.map((tile) => (
                      <button
                        key={tile.id}
                        type="button"
                        onClick={() => setTileId(tile.id)}
                        title={tile.label}
                        aria-pressed={tileId === tile.id}
                        className={cn(
                          "group rounded-xl border px-1.5 py-2 text-center text-[12px] font-extrabold tabular transition-all",
                          tileId === tile.id
                            ? "border-graphite bg-graphite text-white shadow-[0_4px_14px_rgba(20,25,27,0.25)]"
                            : "border-line bg-white hover:border-graphite/40"
                        )}
                      >
                        {tile.label}
                      </button>
                    ))}
                  </div>
                  <PartImage
                    images={selectedTile.gallery ?? [selectedTile.image]}
                    caption="Плита"
                    label={selectedTile.label}
                  />
                  {!selectedTile.art && (
                    <p className="mt-2 text-[12px] text-graphite/60" role="status">
                      Для выбранной плиты ещё не указан артикул. Её стоимость не включена в итог.
                    </p>
                  )}
                </div>

                {/* профиль */}
                <div>
                  <div className="text-[12.5px] font-bold text-graphite/60 mb-2 flex items-center gap-1.5">
                    <Ruler size={14} strokeWidth={2.2} className="text-graphite/40" aria-hidden="true" />
                    Профиль
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {ARMSTRONG_PROFILES.map((profile) => (
                      <button
                        key={profile.id}
                        type="button"
                        onClick={() => setProfileId(profile.id)}
                        aria-pressed={profileId === profile.id}
                        className={cn(
                          "rounded-xl border px-1.5 py-2 text-center text-[12px] font-extrabold transition-all",
                          profileId === profile.id
                            ? "border-graphite bg-graphite text-white shadow-[0_4px_14px_rgba(20,25,27,0.25)]"
                            : "border-line bg-white hover:border-graphite/40"
                        )}
                      >
                        {profile.label}
                      </button>
                    ))}
                  </div>
                  <PartImage images={[selectedProfile.image]} caption="Профиль" label={selectedProfile.label} />
                  {!selectedProfile.arts.main37 && (
                    <p className="mt-2 text-[12px] text-graphite/60" role="status">
                      Для профиля «{selectedProfile.label}» нет артикулов в таблице — его позиции не включены в итог.
                    </p>
                  )}
                </div>

                {/* угол */}
                <div>
                  <div className="text-[12.5px] font-bold text-graphite/60 mb-2 flex items-center gap-1.5">
                    <CornerDownRight size={14} strokeWidth={2.2} className="text-graphite/40" aria-hidden="true" />
                    Угол
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {ARMSTRONG_ANGLES.map((angle) => (
                      <button
                        key={angle.id}
                        type="button"
                        onClick={() => setAngleId(angle.id)}
                        aria-pressed={angleId === angle.id}
                        className={cn(
                          "rounded-xl border px-1.5 py-2 text-center text-[12px] font-extrabold transition-all",
                          angleId === angle.id
                            ? "border-graphite bg-graphite text-white shadow-[0_4px_14px_rgba(20,25,27,0.25)]"
                            : "border-line bg-white hover:border-graphite/40"
                        )}
                      >
                        {angle.label}
                      </button>
                    ))}
                  </div>
                  <PartImage images={[selectedAngle.image]} caption="Угол" label={selectedAngle.label} />
                  {!selectedAngle.art && (
                    <p className="mt-2 text-[12px] text-graphite/60" role="status">
                      Для угла «{selectedAngle.label}» нет артикула в таблице — позиция не включена в итог.
                    </p>
                  )}
                </div>

                <div className="text-[12px] text-graphite/50 font-medium">
                  Расчёт по формулам таблицы «Армстронг». Плита 600×600, шаг профилей 600 мм.
                </div>
              </div>
            ) : (
            <>
            {/* cell size */}
            <div>
              <div className="text-[13px] font-bold text-graphite/70 mb-2.5 flex items-center gap-1.5">
                <SquarePen size={14} strokeWidth={2.4} className="text-graphite/40" />
                Размер ячейки, мм
              </div>
              <div className="grid grid-cols-3 gap-2">
                {CELL_SIZES.map((c) => {
                  const active = input.cellMm === c.mm;
                  return (
                    <button
                      key={c.mm}
                      onClick={() => set("cellMm", c.mm)}
                      title={c.note}
                      className={cn(
                        "group rounded-xl border px-1.5 py-2 text-center transition-all",
                        active
                          ? "border-graphite bg-graphite text-white shadow-[0_4px_14px_rgba(20,25,27,0.25)]"
                          : "border-line bg-white hover:border-graphite/40"
                      )}
                    >
                      <svg viewBox="0 0 36 20" className="w-full h-5 mb-1" aria-hidden>
                        <defs>
                          <pattern id={`cp-${c.mm}`} width={c.mm / 8 + 3} height="20" patternUnits="userSpaceOnUse">
                            <line x1="0" y1="0" x2="0" y2="20"
                              stroke={active ? "#FFCB05" : "#a9aca7"} strokeWidth="1.4" />
                          </pattern>
                        </defs>
                        <rect width="36" height="20" fill={`url(#cp-${c.mm})`} />
                      </svg>
                      <span className="block text-[12px] font-extrabold tabular leading-none">{c.mm}×{c.mm}</span>
                    </button>
                  );
                })}
              </div>

              {/* scheme of the selected cell — one full-width image */}
              <div className="mt-3 overflow-hidden rounded-xl border border-line bg-white">
                <CellScheme
                  key={`${input.cellMm}-${input.colorId}`}
                  mm={input.cellMm}
                  colorId={input.colorId}
                  className="block w-full h-auto p-2 animate-scheme-in"
                />
                <div className="flex items-center justify-between border-t border-line bg-smoke px-3 py-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-graphite/45">
                    Схема ячейки
                  </span>
                  <span className="text-[12px] font-extrabold tabular text-graphite">
                    {res.cell.label} мм
                  </span>
                </div>
              </div>

              <div className="mt-2 text-[12px] text-graphite/50 font-medium">
                {res.cell.note}
              </div>
            </div>

            {/* color */}
            <div>
              <div className="text-[13px] font-bold text-graphite/70 mb-2.5 flex items-center gap-1.5">
                <Palette size={14} strokeWidth={2.4} className="text-graphite/40" />
                Цвет профилей
              </div>
              <div className="grid grid-cols-3 gap-2">
                {COLORS.map((c) => {
                  const active = input.colorId === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => set("colorId", c.id)}
                      className={cn(
                        "rounded-xl border py-2.5 flex flex-col items-center gap-1.5 transition-all",
                        active ? "border-graphite bg-smoke" : "border-line hover:border-graphite/40"
                      )}
                    >
                      <span
                        className={cn(
                          "w-7 h-7 rounded-full border border-graphite/15 transition-transform",
                          active && "scale-110 ring-[3px] ring-pro"
                        )}
                        style={{ background: c.hex }}
                      />
                      <span className="text-[11px] font-bold leading-none">{c.name}</span>
                      <span className="text-[9.5px] text-graphite/45 leading-none">{c.ral}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            </>
            )}

            {/* hanger */}
            <div>
              <div className="text-[13px] font-bold text-graphite/70 mb-2.5 flex items-center gap-1.5">
                <MoveVertical size={14} strokeWidth={2.4} className="text-graphite/40" />
                Длина подвеса (запотолочное пространство)
              </div>
              <div className="grid grid-cols-4 gap-2">
                {HANGERS.map((h) => {
                  const active = input.hangerLen === h.len;
                  return (
                    <button
                      key={h.len}
                      onClick={() => set("hangerLen", h.len)}
                      className={cn(
                        "rounded-xl border py-2 text-center transition-all",
                        active
                          ? "border-graphite bg-graphite text-white"
                          : "border-line bg-white hover:border-graphite/40"
                      )}
                    >
                      <span className="block text-[13px] font-extrabold tabular">{h.len}</span>
                      <span className={cn("block text-[10px] font-semibold", active ? "text-white/60" : "text-graphite/45")}>мм</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* spare % */}
            <div>
              <div className="text-[13px] font-bold text-graphite/70 mb-2 flex items-center gap-1.5">
                <PackagePlus size={14} strokeWidth={2.4} className="text-graphite/40" />
                Запас
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range" min={0} max={20} step={1} value={input.sparePct}
                  onChange={(e) => set("sparePct", parseInt(e.target.value, 10))}
                  className="pro-range flex-1"
                  style={{ "--fill": `${(input.sparePct / 20) * 100}%` } as React.CSSProperties}
                />
                <div className="flex items-center gap-1 shrink-0">
                  <input
                    value={String(input.sparePct)}
                    onChange={(e) => {
                      const v = parseInt(e.target.value.replace(/\D/g, ""), 10);
                      if (!Number.isNaN(v)) set("sparePct", Math.min(50, Math.max(0, v)));
                    }}
                    inputMode="numeric"
                    className="no-spin w-[64px] text-center text-[15px] font-extrabold bg-smoke rounded-lg px-2 py-1.5 outline-none border border-transparent focus:border-pro transition-colors tabular"
                  />
                  <span className="text-[13px] font-bold text-graphite/50">%</span>
                </div>
              </div>
              <div className="mt-2 text-[12px] text-graphite/50 font-medium">
                Добавляется к количеству всего рассчитываемого товара
              </div>
            </div>
          </motion.div>

          {/* -------- right column -------- */}
          <div className="space-y-5 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={cn("grid gap-5 items-stretch", showPlan && "xl:grid-cols-[minmax(0,1fr)_320px]")}
            >
              {showPlan && (
                <PlanPreview
                  input={input}
                  blocks={res.reshetka}
                  railStep={res.rows.some((r) => r.key === "g12") ? 1.2 : 0.6}
                />
              )}

              {/* totals card */}
              <div className="rounded-2xl bg-graphite text-white p-5 flex flex-col justify-between shadow-[0_16px_40px_rgba(20,25,27,0.35)] relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-pro/15 blur-2xl" />
                <div className={cn("relative", !showPlan && "md:flex md:items-center md:justify-between md:gap-10")}>
                  <div className="shrink-0">
                    <div className="text-[11.5px] font-extrabold tracking-[0.16em] uppercase text-white/50">
                      Итого материалы
                    </div>
                    <div className="mt-1.5 text-[40px] leading-none font-black text-pro tabular">
                      {fmt.format(totalShown)} <span className="text-[24px]">₽</span>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "mt-3 space-y-1.5 text-[13px] font-semibold text-white/65",
                      !showPlan && "md:mt-0 md:grid md:flex-1 md:max-w-[460px] md:grid-cols-2 md:gap-x-10 md:gap-y-1.5 md:space-y-0"
                    )}
                  >
                    <div className="flex justify-between gap-3">
                      <span>Цена за м²</span>
                      <span className="text-white tabular">{fmtMoney(res.perM2)}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span>Позиций в смете</span>
                      <span className="text-white tabular">{res.positions}</span>
                    </div>
                    {armstrong ? (
                      <div className="flex justify-between gap-3">
                        <span>Плит 600×600</span>
                        <span className="text-white tabular">{fmt1(res.reshetka)} шт</span>
                      </div>
                    ) : (
                      <div className="flex justify-between gap-3">
                        <span>Решётка 600×600</span>
                        <span className="text-white tabular">{fmt1(res.reshetka)} шт</span>
                      </div>
                    )}
                    <div className="flex justify-between gap-3">
                      {armstrong ? (
                        <>
                          <span>Плита</span>
                          <span className="min-w-0 text-right text-white">{selectedTile.label}</span>
                        </>
                      ) : (
                        <>
                          <span>Ячейка / цвет</span>
                          <span className="text-white">{res.cell.label} · {res.color.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* spec table */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-line bg-white overflow-hidden shadow-[0_2px_20px_rgba(20,25,27,0.04)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 lg:px-5 py-3.5 border-b border-line">
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet size={18} strokeWidth={2.3} className="text-graphite/50" />
                  <span className="text-[15px] font-extrabold">Спецификация материалов</span>
                    {false && null}
                </div>
                <div className="flex items-center gap-2">
                  {printHref && !armstrong ? (
                    <a
                      href={printHref}
                      onClick={() => saveCalcInput(input)}
                      className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-line text-[12.5px] font-bold text-graphite/75 hover:border-graphite/50 transition-colors"
                    >
                      <Printer size={14} strokeWidth={2.4} />
                      Печать
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-line text-[12.5px] font-bold text-graphite/75 hover:border-graphite/50 transition-colors"
                    >
                      <Printer size={14} strokeWidth={2.4} />
                      Печать
                    </button>
                  )}
                  {printMessage && (
                    <span className="text-[12px] font-semibold text-graphite/55">{printMessage}</span>
                  )}
                </div>
              </div>

              <PriceStatusBar
                status={status} updatedAt={updatedAt} refreshing={refreshing}
                changed={changed} onRefresh={refresh}
              />
              {missingCount > 0 && (
                <div className="flex items-center gap-2 px-4 lg:px-5 py-2 bg-red-50 border-b border-red-100 text-[12.5px] font-semibold text-red-800">
                  <TriangleAlert size={14} strokeWidth={2.5} />
                  {armstrong
                    ? `Для ${missingCount} поз. нет цены. Их стоимость не включена в итог.`
                    : `Для ${missingCount} поз. нет цены в таблице — добавьте артикул в столбец A листа цен.`}
                </div>
              )}

              <div className="overflow-x-auto thin-scroll">
                <table className="w-full min-w-[720px] text-[13.5px]">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-graphite/45 border-b border-line">
                      <th className="font-bold px-4 lg:px-5 py-2.5">Артикул</th>
                      <th className="font-bold px-3 py-2.5">Наименование</th>
                      <th className="font-bold px-3 py-2.5 text-right">Кол-во</th>
                      <th className="font-bold px-3 py-2.5 text-right">Цена, ₽</th>
                      <th className="font-bold px-4 lg:px-5 py-2.5 text-right">Сумма, ₽</th>
                    </tr>
                  </thead>
                  <tbody>
                    {res.rows.map((r, i) => (
                      <tr
                        key={r.key}
                        className={cn(
                          "border-b border-line/70 transition-colors hover:bg-pro/10",
                          i % 2 === 1 && "bg-smoke/60"
                        )}
                      >
                        <td className="px-4 lg:px-5 py-3 font-bold tabular whitespace-nowrap">
                          {r.url ? (
                            <a
                              href={r.url} target="_blank" rel="noreferrer"
                              title="Открыть товар на lemanapro.ru"
                              className="inline-flex items-center gap-1 text-graphite/60 hover:text-graphite underline decoration-pro decoration-2 underline-offset-4"
                            >
                              {r.art}
                              <ExternalLink size={11} strokeWidth={2.6} className="opacity-60" />
                            </a>
                          ) : (
                            <span className="text-graphite/60">{r.art || "Не указан"}</span>
                          )}
                        </td>
                        <td className="px-3 py-3 font-semibold text-graphite/90">{r.name}</td>
                        <td className="px-3 py-3 text-right tabular font-bold">
                          {fmt.format(r.qty)} <span className="text-graphite/40 font-semibold">{r.unit}</span>
                        </td>
                        <td className="px-3 py-3 text-right tabular text-graphite/70">
                          {r.missing ? <span className="text-red-600 font-bold">нет цены</span> : fmtPrice(r.price)}
                        </td>
                        <td className="px-4 lg:px-5 py-3 text-right tabular font-extrabold">
                          {armstrong && r.missing ? <span className="text-red-600">нет цены</span> : fmtPrice(r.sum)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {showTableTotal && (
                    <tfoot>
                      <tr className="bg-graphite text-white">
                        <td className="px-4 lg:px-5 py-3.5 font-extrabold text-[12px] uppercase tracking-widest" colSpan={2}>
                          Итого по смете
                        </td>
                        <td className="px-3 py-3.5 text-right tabular text-white/60 text-[12.5px] font-bold">
                          {res.area > 0 && `${fmtMoney(res.perM2)}/м²`}
                        </td>
                        <td colSpan={2} className="px-4 lg:px-5 py-3.5 text-right text-[40px] leading-none font-black text-pro tabular whitespace-nowrap">
                          {fmt.format(totalShown)} <span className="text-[24px]">₽</span>
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* sticky mobile totals bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-graphite text-white border-t border-white/10 shadow-[0_-8px_30px_rgba(20,25,27,0.35)]">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="min-w-0">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-white/45 leading-none">Итого</div>
            <div className="text-[20px] font-black text-pro tabular leading-tight">{fmt.format(totalShown)} ₽</div>
          </div>
          <button
            onClick={downloadCsv}
            className="ml-auto h-10 px-3.5 rounded-xl border border-white/20 text-[12.5px] font-bold flex items-center gap-1.5"
          >
            <Download size={15} strokeWidth={2.5} /> CSV
          </button>
        </div>
      </div>
    </section>
  );
}
