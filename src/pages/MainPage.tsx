import { motion } from "framer-motion";
import {
  ArrowRight,
  Grid3X3,
  Layers3,
  Ruler,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { STORE } from "../data/grilyato";
import SiteFooter from "../components/SiteFooter";

const ease = [0.22, 1, 0.36, 1] as const;

const systems = [
  {
    name: "Грильято",
    eyebrow: "Ячеистый потолок",
    description:
      "Алюминиевая решётчатая система для торговых залов, офисов и общественных пространств.",
    image: "images/grilyato-hero.jpg",
    href: "#/grilyato",
    action: "Открыть калькулятор",
    tags: ["50×50", "75×75", "100×100"],
    Icon: Grid3X3,
    featured: true,
  },
  {
    name: "Армстронг",
    eyebrow: "Модульный потолок",
    description:
      "Практичная система с плитами 600×600 для акустического комфорта и быстрого доступа к коммуникациям.",
    image: "images/armstrong-hero.jpg",
    href: "#/armstrong",
    action: "Подробнее о системе",
    tags: ["600×600", "Т-24", "НГ"],
    Icon: Layers3,
    featured: false,
  },
];

export default function MainPage() {
  return (
    <>
      <section id="top" className="relative overflow-hidden bg-graphite text-white">
        <div className="absolute inset-0">
          <img
            src="images/grilyato-hero.jpg"
            alt="Современный интерьер с подвесным потолком"
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/88 to-graphite/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-graphite via-transparent to-graphite/60" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-4 pb-16 pt-16 lg:px-8 lg:pb-24 lg:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[13px] font-semibold text-white/85 backdrop-blur"
          >
            <span className="h-2 w-2 rounded-full bg-pro" />
            Подвесные потолки · {STORE.city}
          </motion.div>

          <div className="mt-6 max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.08, ease }}
              className="text-[44px] font-black leading-[0.98] tracking-[-0.02em] sm:text-[64px] lg:text-[84px]"
            >
              Потолочные системы
              <br />
              <span className="text-pro">для ваших проектов</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.18, ease }}
              className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/70 lg:text-[18px]"
            >
              Выберите тип потолка, посмотрите характеристики и рассчитайте комплект материалов для
              вашего помещения с актуальными артикулами и ценами Лемана ПРО Челябинск.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.28, ease }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href="#systems"
                className="group inline-flex h-[52px] items-center gap-2.5 rounded-2xl bg-pro px-7 text-[15px] font-extrabold text-graphite transition-all hover:gap-4 hover:bg-pro-soft"
              >
                Выбрать систему
                <ArrowRight size={19} strokeWidth={2.6} className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.42, ease }}
            className="mt-14 grid max-w-4xl grid-cols-2 gap-3 lg:grid-cols-4"
          >
            {[
              { value: "2", label: "потолочные системы" },
              { value: "600×600", label: "базовый модуль" },
              { value: "от 3-х дней", label: "доставка по Челябинску" },
              { value: "1 мин", label: "до готовой сметы" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur transition-colors hover:border-pro/50"
              >
                <div className="text-[24px] font-black leading-none tabular lg:text-[27px]">{item.value}</div>
                <div className="mt-1 text-[12px] leading-snug text-white/60">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="systems" className="scroll-mt-[130px] bg-smoke py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease }}
            className="mb-10 flex flex-wrap items-end justify-between gap-5"
          >
            <div>
              <div className="mb-2 text-[12.5px] font-extrabold uppercase tracking-[0.18em] text-graphite/45">
                Каталог систем
              </div>
              <h2 className="text-[32px] font-black leading-[1.02] tracking-[-0.01em] lg:text-[46px]">
                Выберите потолок
              </h2>
            </div>
            <p className="max-w-md text-[14px] leading-relaxed text-graphite/60">
              Две системы для разных задач. Перейдите на страницу системы, чтобы получить материалы,
              особенности монтажа и доступные калькуляторы.
            </p>
          </motion.div>

          <div className="grid gap-5 lg:grid-cols-2">
            {systems.map(({ name, eyebrow, description, image, href, action, tags, Icon, featured }, index) => (
              <motion.a
                key={name}
                href={href}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.75, delay: index * 0.1, ease }}
                className="group relative min-h-[430px] overflow-hidden rounded-3xl border border-line bg-graphite text-white shadow-[0_12px_34px_rgba(20,25,27,0.12)]"
              >
                <img
                  src={image}
                  alt={`Подвесной потолок ${name}`}
                  className="absolute inset-0 h-full w-full object-cover opacity-55 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/55 to-graphite/10" />
                {featured && (
                  <span className="absolute right-5 top-5 rounded-full bg-pro px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-graphite">
                    Калькулятор доступен
                  </span>
                )}
                <div className="relative flex h-full min-h-[430px] flex-col justify-end p-6 lg:p-8">
                  <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-pro text-graphite">
                    <Icon size={22} strokeWidth={2.3} />
                  </div>
                  <div className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-pro">{eyebrow}</div>
                  <h3 className="mt-2 text-[36px] font-black leading-none tracking-[-0.02em]">{name}</h3>
                  <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-white/70">{description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-[11.5px] font-bold text-white/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="mt-7 inline-flex items-center gap-2 text-[14px] font-extrabold text-pro transition-all group-hover:gap-3">
                    {action}
                    <ArrowRight size={16} strokeWidth={2.6} />
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1400px] gap-5 px-4 lg:grid-cols-3 lg:px-8">
          {[
            { icon: Ruler, title: "Подбор под помещение", text: "Поможем выбрать модуль, профиль и высоту запотолочного пространства." },
            { icon: ShieldCheck, title: "Проверенные решения", text: "Системы для офисов, магазинов, коридоров, холлов и технических помещений." },
            { icon: Truck, title: "Доставка и самовывоз", text: "Доставим по Челябинску от 3-х дней или подготовим заказ к выдаче." },
          ].map(({ icon: Icon, title, text }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.65, delay: index * 0.08, ease }}
              className="rounded-3xl border border-line bg-white p-6 shadow-[0_2px_20px_rgba(20,25,27,0.04)]"
            >
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-pro text-graphite">
                <Icon size={20} strokeWidth={2.3} />
              </div>
              <h3 className="mb-1.5 text-[16px] font-extrabold">{title}</h3>
              <p className="text-[13.5px] leading-relaxed text-graphite/60">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}