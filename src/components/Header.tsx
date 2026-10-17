import { useEffect, useRef, useState } from "react";
import { MapPin, Truck, Store, Calculator, ChevronDown } from "lucide-react";
import { STORE } from "../data/grilyato";

export function LogoMark({
  height = 58,
  cityColor = "#FFFFFF",
  className,
}: {
  height?: number;
  /** цвет надписи «Челябинск»; на тёмном фоне — белый */
  cityColor?: string;
  className?: string;
}) {
  return (
    <svg
      height={height}
      width={(height * 130) / 84}
      viewBox="0 0 130 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Челябинск Стройка"
    >
      <g transform="translate(65,0) scale(1.8) translate(-36,0)">
        <path d="M41.1247 5.17859L36.9501 11.19L40.7269 14.9211V20.7547H32.6301L31.2715 26.9992H48V11.9766L41.1247 5.17859Z" fill="#C5861E" />
        <path d="M31.2715 20.7534V26.9979L32.6304 20.7534H31.2715Z" fill="#855D12" />
        <path d="M35.9991 10.2466L41.1246 5.17859L36.9485 11.1853L35.9991 10.2466Z" fill="#855D12" />
        <path d="M36.0009 0.109989L24 11.976V26.9984H31.2733V20.7539V14.9202L36.0009 10.2457L41.1263 5.17796L36.0009 0.109989Z" fill="#FFBF2F" />
        <rect x="31.27" y="14.92" width="9.46" height="5.84" fill="#C5861E" />
        <rect x="33.6" y="15.9" width="12.7" height="3.7" rx="0.7" fill="#20282B" />
        <rect x="40.6" y="17.1" width="1.2" height="1.3" rx="0.2" fill="#FFBF2F" />
        <rect x="42.3" y="17.1" width="1.2" height="1.3" rx="0.2" fill="#FFBF2F" />
        <rect x="44" y="17.1" width="1.4" height="1.3" rx="0.2" fill="#FFBF2F" />
        <rect x="33.6" y="21.1" width="3.3" height="2.2" rx="0.5" fill="#20282B" />
        <rect x="38.3" y="21.1" width="3.3" height="2.2" rx="0.5" fill="#20282B" />
        <rect x="43" y="21.1" width="3.3" height="2.2" rx="0.5" fill="#20282B" />
        <rect x="35" y="24.2" width="2.6" height="1.9" rx="0.5" fill="#20282B" />
        <rect x="38.9" y="24.2" width="2.6" height="1.9" rx="0.5" fill="#20282B" />
        <rect x="43" y="24.2" width="3.3" height="1.9" rx="0.5" fill="#FFBF2F" />
      </g>
      <text
        x="65"
        y="68"
        textAnchor="middle"
        fontFamily="'Montserrat', sans-serif"
        fontSize="12"
        fontWeight="800"
        letterSpacing="1.5"
        fill={cityColor}
      >
        Челябинск
      </text>
      <text
        x="65"
        y="81"
        textAnchor="middle"
        fontFamily="'Montserrat', sans-serif"
        fontSize="10.5"
        fontWeight="800"
        letterSpacing="2"
        fill="#FFBF2F"
      >
        СТРОЙКА
      </text>
    </svg>
  );
}

const TICKER_ITEMS = [
  "Лемана Про Челябинск — Подвесные потолки",
  "Точная смета за 1 минуту",
  "Доставка от 3х дней",
];

export default function Header({ route = "/" }: { route?: string }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const onArmstrong = route.startsWith("/armstrong");
  const onGrilyato = route.startsWith("/grilyato");
  const onTest = route.startsWith("/test");
  const onSmeta = route.startsWith("/smeta");

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      {/* utility bar */}
      <div className="hidden md:block bg-ink text-white/70">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8 h-9 flex items-center justify-between text-[12.5px]">
          <nav className="flex items-center gap-5">
            {/* выпадающий список */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="flex items-center gap-1.5 text-white/70 hover:text-pro transition-colors"
              >
                Калькуляторы
                <ChevronDown size={14} strokeWidth={2.5}
                  className={`opacity-60 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
              </button>

              {open && (
                <div className="absolute left-0 top-full pt-2 z-50">
                  <div className="w-48 rounded-2xl bg-white text-graphite shadow-[0_16px_40px_rgba(20,25,27,0.25)] border border-line py-1.5">
                    {[
                      { label: "Грильято", href: "#/grilyato", current: onGrilyato },
                      { label: "Армстронг", href: "#/armstrong", current: onArmstrong },
                      { label: "Тест", href: "#/test", current: onTest },
                      { label: "Спецификация материалов Грильято", href: "#/smeta", current: onSmeta },
                    ].map((item, i) =>
                      item.href ? (
                        <a
                          key={`${item.label}-${i}`}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={`flex items-center justify-between gap-2 w-full text-left px-4 py-2.5 text-[13.5px] font-semibold transition-colors ${
                            item.current ? "bg-pro/25 text-graphite" : "text-graphite/70 hover:bg-pro/20"
                          }`}
                        >
                          {item.label}
                          {item.current && <span className="w-1.5 h-1.5 rounded-full bg-graphite shrink-0" />}
                        </a>
                      ) : (
                        <span
                          key={`${item.label}-${i}`}
                          className="block w-full text-left px-4 py-2.5 text-[13.5px] font-semibold text-graphite/35 cursor-default"
                        >
                          {item.label}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            {onGrilyato && (
              <a href="#/grilyato#features" className="hover:text-pro transition-colors">О системе Грильято</a>
            )}
            {onArmstrong && (
              <a href="#/armstrong#features" className="hover:text-pro transition-colors">О системе Армстронг</a>
            )}
          </nav>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Store size={13} strokeWidth={2.2} className="text-pro" /> {STORE.address}
            </span>
            <span className="flex items-center gap-1.5">
              <Truck size={13} strokeWidth={2.2} className="text-pro" /> Доставка и подъём
            </span>
          </div>
        </div>
      </div>

      {/* main masthead */}
      <div className="bg-graphite text-white shadow-[0_8px_30px_rgba(20,25,27,0.25)]">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8 h-[68px] flex items-center gap-3 lg:gap-5">
          <a href="#/" className="flex items-center shrink-0 group" aria-label="Челябинск Стройка — на главную">
            <LogoMark height={54} className="transition-transform group-hover:scale-105" />
          </a>

          <div className="flex-1" />

          <button className="hidden sm:flex items-center gap-1 text-[13.5px] font-semibold text-white/85 hover:text-pro transition-colors">
            <MapPin size={16} strokeWidth={2.3} className="text-pro" />
            {STORE.city}
          </button>

        </div>
      </div>

      {/* yellow title ticker */}
      <div className="bg-pro text-graphite overflow-hidden border-b border-graphite/10">
        <div className="animate-ticker flex w-max items-center">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center shrink-0" aria-hidden={copy === 1}>
              {TICKER_ITEMS.map((t, i) => (
                <span key={i} className="flex items-center gap-3 px-6 py-2 text-[13px] font-bold tracking-wide whitespace-nowrap">
                  {i === 0 ? <Calculator size={14} strokeWidth={2.6} /> : <span className="w-1.5 h-1.5 rounded-full bg-graphite/70" />}
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
