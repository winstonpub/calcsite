import { motion } from "framer-motion";
import {
  Calculator, ShieldCheck, Layers, Recycle,
  ExternalLink,
} from "lucide-react";
import { SizeGuide } from "./SizeGuide";
import SiteFooter from "./SiteFooter";

const ease = [0.22, 1, 0.36, 1] as const;

/* ------------------------------- System block ------------------------------- */
function SystemBlock() {
  const feats = [
    { icon: Layers, title: "Скрытый монтаж", text: "Решётка 600×600 укладывается на несущие направляющие — над ней остаются работающие коммуникации и светильники." },
    { icon: ShieldCheck, title: "Алюминий не горит", text: "Профили «мама» и «папа» из алюминия: класс НГ, влагостойкость, срок службы 25+ лет." },
    { icon: Recycle, title: "Доступ в любую точку", text: "Блок снимается без инструмента — удобно обслуживать вентиляцию, датчики и проводку." },
  ];
  return (
    <section id="features" className="bg-graphite text-white py-14 lg:py-20 relative overflow-hidden scroll-mt-[130px]">
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
        backgroundSize: "56px 56px",
      }} />
      <div className="relative mx-auto max-w-[1400px] px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease }}
          >
            <div className="text-[12.5px] font-extrabold tracking-[0.18em] uppercase text-pro mb-2">
              Система Грильято
            </div>
            <h2 className="text-[30px] lg:text-[42px] font-black tracking-[-0.01em] leading-[1.05]">
              Потолок, который<br />работает на пространство
            </h2>
            <p className="mt-4 text-white/60 text-[15px] lg:text-[16px] leading-relaxed max-w-lg">
              Grigliato — модульный решётчатый потолок из U-образных профилей.
              Визуально лёгкий, скрывает инженерию, пропускает свет и воздух.
              Подходит для магазинов, офисов, холлов, спортклубов и ТРЦ
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {feats.map(({ icon: Icon, title, text }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease }}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 hover:border-pro/60 transition-colors"
                >
                  <Icon size={20} strokeWidth={2.2} className="text-pro mb-2.5" />
                  <div className="font-extrabold text-[15px] mb-1">{title}</div>
                  <div className="text-[13px] leading-relaxed text-white/55">{text}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, ease }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
              <img
                src="images/grilyato-detail.jpg"
                alt="Профиль Грильято крупным планом"
                className="w-full h-[380px] lg:h-[520px] object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-graphite/95 to-transparent p-6 pt-16">
                <div className="text-[13px] font-bold text-pro uppercase tracking-widest mb-1">Профиль U-образный</div>
                <div className="text-white/80 text-[14px] font-medium">
                  «Мама» несёт прорези под «папу» — ячейка собирается без саморезов, защёлками.
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-3 lg:-right-5 rounded-2xl bg-pro text-graphite px-4 py-3 shadow-xl animate-floaty">
              <div className="text-[22px] font-black leading-none">40мм</div>
              <div className="text-[11px] font-bold">высота профиля</div>
            </div>
          </motion.div>
        </div>

        {/* подробно о каждом типоразмере */}
        <SizeGuide />

        {/* methodology strip */}
        <motion.a
          href="https://albes.ru/kalkulyatory/calc_potolki_grilyato/grilyato/" target="_blank" rel="noreferrer"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.7, ease }}
          className="mt-12 group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-pro/30 bg-pro/[0.06] px-5 lg:px-7 py-5 hover:bg-pro/[0.12] transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-pro grid place-items-center text-graphite shrink-0">
              <Calculator size={20} strokeWidth={2.4} />
            </div>
            <div>
              <div className="font-extrabold text-[15.5px]">Методика расчёта — открытая</div>
              <div className="text-[13px] text-white/55">
                Для образца был использован калькулятор потолков Грильято от производителя Албес.
              </div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[13.5px] font-extrabold text-pro group-hover:gap-3 transition-all">
            Открыть сайт <ExternalLink size={15} strokeWidth={2.6} />
          </span>
        </motion.a>
      </div>
    </section>
  );
}

export default function Sections() {
  return (
    <>
      <SystemBlock />
      <SiteFooter />
    </>
  );
}
