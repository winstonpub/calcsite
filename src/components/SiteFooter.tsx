import { Clock, MapPin } from "lucide-react";
import { STORE } from "../data/grilyato";
import { LogoMark } from "./Header";

/** Общий подвал для всех страниц сайта. */
export default function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[1400px] px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <a href="#/" className="inline-flex items-center" aria-label="Челябинск Стройка — на главную">
              <LogoMark height={54} />
            </a>
          </div>

          <div>
            <div className="mb-4 text-[12px] font-extrabold uppercase tracking-[0.16em] text-white/40">
              Калькуляторы
            </div>
            <ul className="space-y-2.5 text-[13.5px] font-semibold text-white/70">
              <li>
                <a href="#/grilyato" className="transition-colors hover:text-pro">
                  Грильято
                </a>
              </li>
              <li>
                <a href="#/armstrong" className="transition-colors hover:text-pro">
                  Армстронг
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-4 text-[12px] font-extrabold uppercase tracking-[0.16em] text-white/40">Магазин</div>
            <ul className="space-y-3 text-[13.5px] text-white/70">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} strokeWidth={2.3} className="mt-0.5 shrink-0 text-pro" />
                {STORE.fullAddress}
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={15} strokeWidth={2.3} className="mt-0.5 shrink-0 text-pro" />
                {STORE.hours}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-[12px] font-medium text-white/35">
          Челябинск · Калькуляторы Стройка · {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
