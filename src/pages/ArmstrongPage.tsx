import { motion } from "framer-motion";
import {
  Ruler, ShieldCheck, Sparkles, Clock, LayoutGrid, Wrench,
  Droplets, Flame, ArrowRight, Truck, Layers3,
} from "lucide-react";
import { STORE } from "../data/grilyato";
import SiteFooter from "../components/SiteFooter";

const ease = [0.22, 1, 0.36, 1] as const;

const FEATURES = [
  { icon: LayoutGrid, title: "Модуль 600×600", desc: "Стандартная ячейка подвесной системы, плиты легко подгоняются под любую планировку." },
  { icon: ShieldCheck, title: "Акустика до NRC 0,85", desc: "Плиты из минерального волокна поглощают шум — комфортно в офисах и переговорных." },
  { icon: Sparkles, title: "Замена за минуты", desc: "Любая плита снимается и ставится обратно без демонтажа каркаса и инструмента." },
  { icon: Clock, title: "Монтаж 40–60 м² в день", desc: "Бригада из двух человек собирает потолок за один рабочий день." },
  { icon: Flame, title: "Класс НГ", desc: "Негорючий материал, не выделяет вредных веществ при нагреве." },
  { icon: Droplets, title: "Влагостойкие серии", desc: "Для санузлов, кухонь и помещений с повышенной влажностью." },
];

const TECH = [
  { k: "Размер плиты", v: "600 × 600 мм" },
  { k: "Толщина плиты", v: "12–15 мм" },
  { k: "Класс пожарной опасности", v: "НГ" },
  { k: "Поглощение звука (NRC)", v: "до 0,85" },
  { k: "Светоотражение", v: "до 85 %" },
  { k: "Тип подвесной системы", v: "Т-24 / Т-15" },
];

const STEPS = [
  { n: "01", title: "Замер помещения", text: "Определяем площадь, периметр и высоту запотолочного пространства." },
  { n: "02", title: "Подбор системы", text: "Выбираем серию плит, каркас Т-24 и длину подвесов под ваши задачи." },
  { n: "03", title: "Монтаж и сдача", text: "Разметка, каркас, укладка плит, установка светильников и диффузоров." },
];

export default function ArmstrongPage() {
  return (
    <>
      {/* ---------------- hero ---------------- */}
      <section className="relative overflow-hidden bg-graphite text-white">
        <div className="absolute inset-0">
          <img
            src="images/armstrong-hero.jpg"
            alt="Подвесной потолок Армстронг в современном офисе"
            className="w-full h-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/85 to-graphite/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-graphite via-transparent to-graphite/55" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-4 lg:px-8 pt-16 pb-14 lg:pt-24 lg:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[13px] font-semibold text-white/85"
          >
            <span className="w-2 h-2 rounded-full bg-pro" />
            Подвесные потолки · {STORE.city}
          </motion.div>

          <div className="mt-6 max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.08, ease }}
              className="text-[44px] leading-[0.98] sm:text-[64px] lg:text-[84px] font-black tracking-[-0.02em]"
            >
              Потолки
              <br />
              <span className="text-pro">Армстронг</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.18, ease }}
              className="mt-5 max-w-xl text-[16px] lg:text-[18px] leading-relaxed text-white/70"
            >
              Модульная подвесная система с акустическими плитами: скрывает коммуникации,
              снижает шум и даёт доступ в любую точку запотолочного пространства.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.28, ease }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href="#/grilyato"
                className="group inline-flex items-center gap-2.5 h-[52px] px-7 rounded-2xl bg-pro text-graphite font-extrabold text-[15px] hover:bg-pro-soft transition-all hover:gap-4"
              >
                К калькулятору Грильято
                <ArrowRight size={19} strokeWidth={2.6} className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.42, ease }}
            className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl"
          >
            {[
              { icon: LayoutGrid, big: "6 видов", small: "потолочных плит" },
              { icon: Layers3, big: "3 вида", small: "материалов: минеральная вата, сталь и алюминий" },
              { icon: Truck, big: "от 3-х дней", small: "доставка по Челябинску" },
            ].map(({ icon: Icon, big, small }) => (
              <div key={small} className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur px-4 py-4 hover:border-pro/50 transition-colors">
                <Icon size={18} strokeWidth={2.2} className="text-pro" />
                <div className="mt-2 text-[26px] font-black leading-none tabular">{big}</div>
                <div className="mt-1 text-[12.5px] leading-snug text-white/60">{small}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------------- features ---------------- */}
      <section id="features" className="bg-smoke py-14 lg:py-20 scroll-mt-[130px]">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease }}
            className="mb-10"
          >
            <div className="text-[12.5px] font-extrabold tracking-[0.18em] uppercase text-graphite/45 mb-2">
              Преимущества
            </div>
            <h2 className="text-[30px] lg:text-[42px] font-black tracking-[-0.01em]">
              Почему выбирают Армстронг
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.07, ease }}
                className="rounded-3xl bg-white border border-line p-6 shadow-[0_2px_20px_rgba(20,25,27,0.04)] hover:border-pro/50 transition-colors"
              >
                <div className="w-11 h-11 rounded-2xl bg-pro grid place-items-center text-graphite mb-4">
                  <Icon size={20} strokeWidth={2.3} />
                </div>
                <h3 className="text-[16px] font-extrabold mb-1.5">{title}</h3>
                <p className="text-[13.5px] text-graphite/60 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- photo + tech ---------------- */}
      <section className="bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease }}
            className="relative rounded-3xl overflow-hidden border border-line shadow-[0_16px_50px_rgba(20,25,27,0.12)]"
          >
            <img
              src="images/armstrong-hero.jpg"
              alt="Фрагмент подвесного потолка Армстронг"
              className="w-full h-[340px] lg:h-[480px] object-cover"
            />
            <div className="absolute -bottom-4 right-4 rounded-2xl bg-pro text-graphite px-5 py-3 shadow-xl">
              <div className="text-[20px] font-black leading-none">Т-24</div>
              <div className="text-[11px] font-bold">подвесная система</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="text-[12.5px] font-extrabold tracking-[0.18em] uppercase text-graphite/45 mb-2">
              Характеристики
            </div>
            <h2 className="text-[30px] lg:text-[42px] font-black tracking-[-0.01em] leading-[1.05] mb-6">
              Технические данные
            </h2>
            <div className="rounded-3xl border border-line overflow-hidden">
              {TECH.map((row, i) => (
                <div
                  key={row.k}
                  className={`flex items-center justify-between gap-4 px-5 py-3.5 text-[14px] ${
                    i % 2 === 1 ? "bg-smoke" : "bg-white"
                  }`}
                >
                  <span className="text-graphite/60 font-semibold">{row.k}</span>
                  <span className="font-extrabold tabular text-right">{row.v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- steps ---------------- */}
      <section className="bg-graphite text-white py-14 lg:py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="relative mx-auto max-w-[1400px] px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease }}
            className="mb-10"
          >
            <div className="text-[12.5px] font-extrabold tracking-[0.18em] uppercase text-pro mb-2">
              Как проходит монтаж
            </div>
            <h2 className="text-[30px] lg:text-[42px] font-black tracking-[-0.01em]">Три этапа работы</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.65, delay: i * 0.1, ease }}
                className="group relative rounded-3xl border border-white/10 bg-white/[0.04] p-6 lg:p-7 overflow-hidden hover:border-pro/60 transition-colors"
              >
                <div className="absolute -top-5 right-4 text-[92px] font-black text-white/[0.06] leading-none select-none">
                  {s.n}
                </div>
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-pro grid place-items-center text-graphite mb-4 group-hover:scale-110 transition-transform">
                    <Wrench size={19} strokeWidth={2.3} />
                  </div>
                  <h3 className="text-[17px] font-extrabold mb-2">{s.title}</h3>
                  <p className="text-[13.5px] leading-relaxed text-white/60">{s.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* note about calculator */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease }}
            className="mt-12 rounded-2xl border border-pro/30 bg-pro/[0.07] px-5 lg:px-7 py-5 flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-pro grid place-items-center text-graphite shrink-0">
                <Ruler size={20} strokeWidth={2.4} />
              </div>
              <div>
                <div className="font-extrabold text-[15.5px]">Калькулятор Армстронг — в разработке</div>
                <div className="text-[13px] text-white/55">
                  Пока доступен расчёт потолка Грильято: площадь, периметр, спецификация и смета.
                </div>
              </div>
            </div>
            <a
              href="#/grilyato"
              className="inline-flex items-center gap-1.5 text-[13.5px] font-extrabold text-pro hover:gap-3 transition-all"
            >
              Открыть калькулятор <ArrowRight size={15} strokeWidth={2.6} />
            </a>
          </motion.div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
