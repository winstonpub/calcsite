import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Printer, TriangleAlert } from "lucide-react";
import {
  calcGrilyato, fmt, fmt1, fmtMoney, fmtPrice, type CalcInput,
} from "../data/grilyato";
import { usePrices } from "../data/prices";
import { loadCalcInput } from "../utils/calcStorage";
import { printSpec } from "../utils/printSpec";
import SiteFooter from "../components/SiteFooter";
import { cn } from "../utils/cn";

const ease = [0.22, 1, 0.36, 1] as const;

/** Страница «Смета»: спецификация материалов по последнему расчёту + печать. */
export default function SmetaPage() {
  const { prices } = usePrices();
  const [input, setInput] = useState<CalcInput>(() => loadCalcInput());

  // данные могли обновиться в калькуляторе на другой вкладке
  useEffect(() => {
    const sync = () => setInput(loadCalcInput());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const res = useMemo(() => calcGrilyato(input, prices), [input, prices]);
  const missingCount = res.rows.filter((r) => r.missing).length;

  const [printMessage, setPrintMessage] = useState("");
  const handlePrint = () => {
    const ok = printSpec({ input, result: res });
    setPrintMessage(ok ? "Документ открыт для печати" : "Браузер заблокировал окно печати");
    window.setTimeout(() => setPrintMessage(""), 2500);
  };

  const params = [
    { k: "Помещение", v: `${fmt1(input.length)} × ${fmt1(input.width)} м` },
    { k: "Площадь", v: `${fmt1(res.area)} м²` },
    { k: "Периметр", v: `${fmt1(res.perimeter)} м` },
    { k: "Ячейка", v: `${res.cell.label} мм` },
    { k: "Цвет", v: `${res.color.name} · ${res.color.ral}` },
    { k: "Подвес", v: res.hanger.name },
    { k: "Запас", v: `${input.sparePct}%` },
    { k: "Решётка 600×600", v: `${fmt1(res.reshetka)} шт` },
  ];

  return (
    <>
      <section className="bg-smoke py-12 lg:py-16 min-h-[60vh]">
        <div className="mx-auto max-w-[1100px] px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease }}
            className="mb-7 flex flex-wrap items-end justify-between gap-4"
          >
            <div>
              <h1 className="text-[32px] lg:text-[46px] font-black leading-[1.02] tracking-[-0.01em]">
                Спецификация материалов Грильято
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href="#/grilyato#calc"
                className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl border border-line bg-white text-[12.5px] font-bold text-graphite/75 hover:border-graphite/50 transition-colors"
              >
                <ArrowLeft size={14} strokeWidth={2.4} />
                К калькулятору
              </a>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-graphite text-white text-[12.5px] font-bold hover:bg-ink transition-colors"
              >
                <Printer size={14} strokeWidth={2.5} />
                Печать
              </button>
            </div>
          </motion.div>

          {printMessage && (
            <div className="mb-4 text-[12.5px] font-semibold text-graphite/55">{printMessage}</div>
          )}

          {/* параметры расчёта */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.05, ease }}
            className="mb-5 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
          >
            {params.map((p) => (
              <div key={p.k} className="bg-white px-4 py-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-graphite/45">{p.k}</div>
                <div className="mt-0.5 text-[15px] font-extrabold tabular">{p.v}</div>
              </div>
            ))}
          </motion.div>

          {/* таблица спецификации */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="rounded-2xl border border-line bg-white overflow-hidden shadow-[0_2px_20px_rgba(20,25,27,0.04)]"
          >
            {missingCount > 0 && (
              <div className="flex items-center gap-2 px-4 lg:px-5 py-2 bg-red-50 border-b border-red-100 text-[12.5px] font-semibold text-red-800">
                <TriangleAlert size={14} strokeWidth={2.5} />
                Для {missingCount} поз. нет цены в таблице — итог может быть неполным.
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
                    <tr key={r.key} className={cn("border-b border-line/70", i % 2 === 1 && "bg-smoke/60")}>
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
                          <span className="text-graphite/60">{r.art}</span>
                        )}
                      </td>
                      <td className="px-3 py-3 font-semibold text-graphite/90">{r.name}</td>
                      <td className="px-3 py-3 text-right tabular font-bold">
                        {fmt.format(r.qty)} <span className="text-graphite/40 font-semibold">{r.unit}</span>
                      </td>
                      <td className="px-3 py-3 text-right tabular text-graphite/70">
                        {r.missing ? <span className="text-red-600 font-bold">нет цены</span> : fmtPrice(r.price)}
                      </td>
                      <td className="px-4 lg:px-5 py-3 text-right tabular font-extrabold">{fmtPrice(r.sum)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-graphite text-white">
                    <td className="px-4 lg:px-5 py-3.5 font-extrabold text-[12px] uppercase tracking-widest" colSpan={2}>
                      Итого материалы
                    </td>
                    <td className="px-3 py-3.5 text-right tabular text-white/60 text-[12.5px] font-bold">
                      {res.area > 0 && `${fmtMoney(res.perM2)}/м²`}
                    </td>
                    <td colSpan={2} className="px-4 lg:px-5 py-3.5 text-right text-[40px] leading-none font-black text-pro tabular whitespace-nowrap">
                      {fmt.format(res.total)} <span className="text-[24px]">₽</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </motion.div>

        </div>
      </section>

      <SiteFooter />
    </>
  );
}
