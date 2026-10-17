import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Онлайн-цены из Google-таблицы Лемана Про Челябинск.
 * Лист «Цены»: столбец A — артикул, столбец B — цена, столбец C — ссылка на товар.
 */
const SHEET_ID = "16SWWagWF6RLSaoCezFa2J09J1n-RPQ4QDG3b8SpubZg";
const PRICE_GID = "84984568";

export const PRICE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?gid=${PRICE_GID}#gid=${PRICE_GID}`;

const ENDPOINTS = [
  (t: number) =>
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${PRICE_GID}&_=${t}`,
  (t: number) =>
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${PRICE_GID}&_=${t}`,
];

/** авто-обновление цен, мс */
export const REFRESH_MS = 60_000;

export interface PriceEntry {
  price: number;
  url?: string;
}
export type PriceMap = Record<string, PriceEntry>;

const P = (price: number, slug: string): PriceEntry => ({
  price,
  url: `https://chelyabinsk.lemanapro.ru/product/${slug}/`,
});

/** Резервный снимок таблицы — используется, пока цены не загрузились или нет сети */
export const SNAPSHOT_PRICES: PriceMap = {
  "82151718": P(53, "profil-grilyato-albes-mama-50x50x40-mm-belyy-06-m-82151718"),
  "82151719": P(53, "profil-grilyato-albes-papa-50x50x40-mm-belyy-06-m-82151719"),
  "82151720": P(214, "reyka-napravlyayushchaya-grilyato-albes-50x50x40-mm-belyy-24-m-82151720"),
  "82151717": P(53, "reyka-napravlyayushchaya-grilyato-albes-50x50x40-mm-belyy-06-m-82151717"),
  "82151722": P(52, "profil-grilyato-albes-mama-50x50x40-mm-seryy-06-m-82151722"),
  "82151723": P(52, "profil-grilyato-albes-papa-50x50x40-mm-seryy-06-m-82151723"),
  "82151724": P(207, "reyka-napravlyayushchaya-grilyato-albes-50x50x40-mm-seryy-24-m-82151724"),
  "82151721": P(52, "reyka-napravlyayushchaya-grilyato-albes-50x50x40-mm-seryy-06-m-82151721"),
  "82151726": P(54, "profil-grilyato-albes-mama-50x50x40-mm-chernyy-06-m-82151726"),
  "82151727": P(54, "profil-grilyato-albes-papa-50x50x40-mm-chernyy-06-m-82151727"),
  "82151728": P(217, "reyka-napravlyayushchaya-grilyato-albes-50x50x40-mm-chernyy-24-m-82151728"),
  "82151725": P(54, "reyka-napravlyayushchaya-grilyato-albes-50x50x40-mm-chernyy-06-m-82151725"),
  "82151742": P(53, "profil-grilyato-albes-mama-75x75x40-mm-belyy-06-m-82151742"),
  "82151743": P(53, "profil-grilyato-albes-papa-75x75x40-mm-belyy-06-m-82151743"),
  "82151744": P(214, "reyka-napravlyayushchaya-grilyato-albes-75x75x40-mm-belyy-24-m-82151744"),
  "82151741": P(53, "reyka-napravlyayushchaya-grilyato-albes-75x75x40-mm-belyy-06-m-82151741"),
  "82151746": P(52, "profil-grilyato-albes-mama-75x75x40-mm-seryy-06-m-82151746"),
  "82151747": P(52, "profil-grilyato-albes-papa-75x75x40-mm-seryy-06-m-82151747"),
  "82151748": P(207, "reyka-napravlyayushchaya-grilyato-albes-75x75x40-mm-seryy-24-m-82151748"),
  "82151745": P(52, "reyka-napravlyayushchaya-grilyato-albes-75x75x40-mm-seryy-06-m-82151745"),
  "82151750": P(54, "profil-grilyato-albes-mama-75x75x40-mm-chernyy-06-m-82151750"),
  "82151751": P(54, "profil-grilyato-albes-papa-75x75x40-mm-chernyy-06-m-82151751"),
  "82151752": P(217, "reyka-napravlyayushchaya-grilyato-albes-75x75x40-mm-chernyy-24-m-82151752"),
  "82151749": P(54, "reyka-napravlyayushchaya-grilyato-albes-75x75x40-mm-chernyy-06-m-82151749"),
  "82151769": P(37, "profil-grilyato-albes-mama-100x100x40-mm-belyy-06-m-82151769"),
  "82151770": P(53, "profil-grilyato-albes-papa-100x100x40-mm-belyy-06-m-82151770"),
  "82151772": P(214, "reyka-napravlyayushchaya-grilyato-albes-100x100x40-mm-belyy-24-m-82151772"),
  "82151771": P(107, "reyka-napravlyayushchaya-grilyato-albes-100x100x40-mm-belyy-12-m-82151771"),
  "82151768": P(53, "reyka-napravlyayushchaya-grilyato-albes-100x100x40-mm-belyy-06-m-82151768"),
  "82151774": P(52, "profil-grilyato-albes-mama-100x100x40-mm-seryy-06-m-82151774"),
  "82151775": P(52, "profil-grilyato-albes-papa-100x100x40-mm-seryy-06-m-82151775"),
  "82151777": P(207, "reyka-napravlyayushchaya-grilyato-albes-100x100x40-mm-seryy-24-m-82151777"),
  "82151776": P(103, "reyka-napravlyayushchaya-grilyato-albes-100x100x40-mm-seryy-12-m-82151776"),
  "82151773": P(52, "reyka-napravlyayushchaya-grilyato-albes-100x100x40-mm-seryy-06-m-82151773"),
  "82151779": P(54, "profil-grilyato-albes-mama-100x100x40-mm-chernyy-06-m-82151779"),
  "82151780": P(54, "profil-grilyato-albes-papa-100x100x40-mm-chernyy-06-m-82151780"),
  "82151782": P(217, "reyka-napravlyayushchaya-grilyato-albes-100x100x40-mm-chernyy-24-m-82151782"),
  "82151781": P(110, "reyka-napravlyayushchaya-grilyato-albes-100x100x40-mm-chernyy-12-m-82151781"),
  "82151778": P(54, "reyka-napravlyayushchaya-grilyato-albes-100x100x40-mm-chernyy-06-m-82151778"),
  "82151813": P(13.9, "profil-soedinitelnyy-grilyato-50x10-mm-82151813"),
  "82936532": P(31, "evro-podves-albes-l-1500-mm-82936532"),
  "82936531": P(23, "evro-podves-albes-l-1000-mm-82936531"),
  "82936530": P(14.9, "evro-podves-albes-l-500-mm-82936530"),
  "12903338": P(20, "evro-podves-dlya-potolka-v-sbore-275x36-mm-12903338"),
  "82936536": P(176, "ugolok-pl19x24-ekonom-chernyy-82936536"),
  "82936535": P(198, "ugol-pl19x24-metallik-ekonom-82936535"),
  "82936537": P(202, "ugolok-pl19x24-belyy-matovyy-ekonom-82936537"),
};

/* --------------------------------- CSV --------------------------------- */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cur += '"'; i++; } else q = false;
      } else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") { row.push(cur); cur = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cur); cur = "";
      rows.push(row); row = [];
    } else cur += ch;
  }
  if (cur !== "" || row.length) { row.push(cur); rows.push(row); }
  return rows;
}

/** «13,9» / «13.9» / «1 234,5 ₽» → число */
function parsePrice(raw: string | undefined): number | null {
  if (!raw) return null;
  const s = raw.replace(/[\s\u00a0₽руб.р]+$/gi, "").replace(/[\s\u00a0]/g, "").replace(",", ".");
  const v = parseFloat(s);
  return Number.isFinite(v) && v >= 0 ? v : null;
}

export function parsePriceCsv(text: string): PriceMap {
  const map: PriceMap = {};
  for (const r of parseCsv(text)) {
    const art = (r[0] ?? "").trim();
    if (!/^\d{5,}$/.test(art)) continue; // заголовок и пустые строки пропускаем
    const price = parsePrice(r[1]);
    if (price === null) continue;
    const url = (r[2] ?? "").trim();
    map[art] = { price, url: /^https?:\/\//.test(url) ? url : undefined };
  }
  return map;
}

async function fetchPrices(): Promise<PriceMap> {
  let lastErr: unknown = new Error("no endpoints");
  for (const make of ENDPOINTS) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 12_000);
      const res = await fetch(make(Date.now()), { cache: "no-store", signal: ctrl.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const map = parsePriceCsv(await res.text());
      if (Object.keys(map).length < 5) throw new Error("Пустой ответ таблицы");
      return map;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

/* --------------------------------- hook --------------------------------- */
export type PriceStatus = "loading" | "live" | "offline";

export function usePrices() {
  const [prices, setPrices] = useState<PriceMap>(SNAPSHOT_PRICES);
  const [status, setStatus] = useState<PriceStatus>("loading");
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [changed, setChanged] = useState(0);
  const busy = useRef(false);
  const current = useRef<PriceMap>(SNAPSHOT_PRICES);

  const refresh = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setRefreshing(true);
    try {
      const fresh = await fetchPrices();
      const merged: PriceMap = { ...SNAPSHOT_PRICES, ...fresh };
      let diff = 0;
      for (const k of Object.keys(merged)) {
        if (current.current[k]?.price !== merged[k].price) diff++;
      }
      current.current = merged;
      setPrices(merged);
      setChanged(diff);
      setStatus("live");
      setUpdatedAt(new Date());
    } catch {
      setStatus((s) => (s === "live" ? "live" : "offline"));
    } finally {
      busy.current = false;
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, REFRESH_MS);
    const onVis = () => { if (document.visibilityState === "visible") refresh(); };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("online", refresh);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("online", refresh);
    };
  }, [refresh]);

  return { prices, status, updatedAt, refreshing, refresh, changed };
}
