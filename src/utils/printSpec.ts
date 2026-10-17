import {
  fmt1, fmtMoney, fmtPrice,
  type CalcInput, type CalcResult,
} from "../data/grilyato";

export interface PrintData {
  input: CalcInput;
  result: CalcResult;
  /** система потолка: grilyato — по умолчанию, armstrong — по таблице «Армстронг» */
  mode?: "grilyato" | "armstrong";
}

const ESC_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const escapeHtml = (s: unknown) => String(s).replace(/[&<>"']/g, (c) => ESC_MAP[c] ?? c);
/** HTML-документ сметы для печати / сохранения в PDF. */
export function buildPrintHtml({ input, result: res, mode = "grilyato" }: PrintData): string {
  const esc = escapeHtml;

  const printedAt = new Date().toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const area = res.area > 0 ? `${fmt1(res.area)} м²` : "—";
  const room = `${fmt1(input.length)} × ${fmt1(input.width)} м · площадь ${area} · периметр ${fmt1(res.perimeter)} м`;
  const setup = mode === "armstrong"
    ? `Плита: ${res.rows.find((row) => row.key === "tile")?.name ?? "600×600"} · подвес ${res.hanger.name} · запас ${input.sparePct}% · плит 600×600: ${fmt1(res.reshetka)} шт`
    : `Ячейка ${res.cell.label} · цвет ${res.color.name} (${res.color.ral}) · подвес ${res.hanger.name} · запас ${input.sparePct}% · решётка 600×600: ${fmt1(res.reshetka)} шт`;

  const rows = res.rows
    .map((r, i) => {
      const name = r.url
        ? `<a href="${esc(r.url)}">${esc(r.name)}</a>`
        : esc(r.name);
      const price = r.missing ? "нет цены" : fmtPrice(r.price);
      const sum = mode === "armstrong" && r.missing ? "нет цены" : fmtPrice(r.sum);
      return `<tr><td class="n">${i + 1}</td><td class="a">${esc(r.art || "Не указан")}</td><td class="name">${name}</td>`
        + `<td class="q">${fmt1(r.qty)} ${esc(r.unit)}</td><td class="p">${esc(price)}</td><td class="p"><b>${sum}</b></td></tr>`;
    })
    .join("\n");

  const notes = res.rows.some((r) => r.missing)
    ? `<p class="warn">Для некоторых позиций в смете нет цены — итог может быть неполным. Добавьте артикул в столбец A листа цен.</p>`
    : "";

  const perM2 = res.area > 0 ? `<span>(${fmtMoney(res.perM2)}/м²)</span>` : "";

  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>${mode === "armstrong" ? `Спецификация материалов Армстронг - ${esc(area)}` : `Спецификация материалов Грильято — ${esc(area)}, ячейка ${esc(res.cell.label)}`}</title>
<style>
  @page { size: A4; margin: 14mm 12mm; }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, "Segoe UI", "Onest", Roboto, Arial, sans-serif;
    color: #14191b;
    font-size: 11.5pt;
    margin: 0;
  }
  header { margin-bottom: 16px; }
  h1 { font-size: 20pt; margin: 0 0 10px; }
  .meta { color: #6f7775; font-size: 10.5pt; line-height: 1.45; }
  .meta b { color: #14191b; }
  table { width: 100%; border-collapse: collapse; margin: 14px 0; }
  th {
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    font-size: 9pt;
    color: #6f7775;
    border-bottom: 2px solid #14191b;
    padding: 6px 8px;
  }
  td { padding: 7px 8px; border-bottom: 1px solid #e5e4e0; vertical-align: top; }
  tr:nth-child(even) td { background: #f8f8f6; }
  td.n { width: 30px; color: #6f7775; }
  td.a { width: 95px; font-weight: 700; white-space: nowrap; }
  td.name { font-weight: 600; }
  td.q, td.p { white-space: nowrap; text-align: right; font-variant-numeric: tabular-nums; }
  td.q { font-weight: 700; }
  .sum { text-align: right; }
  tfoot td {
    background: #14191b;
    color: #fff;
    font-weight: 800;
    border-bottom: none;
    padding: 10px 8px;
  }
  tfoot .total { text-align: right; font-size: 15pt; color: #ffcb05; }
  tfoot .total span { font-size: 10pt; color: rgba(255,255,255,0.55); font-weight: 600; }
  a { color: inherit; text-decoration: underline; }
  .warn {
    background: #fdf2f2;
    border: 1px solid #f3d2d2;
    color: #8f2b2b;
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 10.5pt;
  }
  footer { margin-top: 18px; color: #8a918e; font-size: 9.5pt; }
  footer a { color: #8a918e; }
  .no-print { margin-top: 18px; text-align: center; }
  .no-print button {
    font: inherit;
    font-weight: 700;
    background: #ffcb05;
    border: none;
    border-radius: 10px;
    padding: 10px 18px;
    cursor: pointer;
  }
  @media print { .no-print { display: none; } }
</style>
</head>
<body>
  <header>
    <h1>${mode === "armstrong" ? "Спецификация материалов Армстронг" : "Спецификация материалов Грильято"}</h1>
    <div class="meta">
      <div>${esc(room)}</div>
      <div><b>${esc(setup)}</b></div>
      <div>Документ сформирован ${esc(printedAt)}. Цены актуальны на момент формирования.</div>
    </div>
  </header>

  <table>
    <thead>
      <tr><th></th><th>Артикул</th><th>Наименование</th><th>Кол-во</th><th>Цена, ₽</th><th class="sum">Сумма, ₽</th></tr>
    </thead>
    <tbody>
${rows}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="5">Итого по смете</td>
        <td class="total">${fmt1(res.total)} ₽ ${perM2}</td>
      </tr>
    </tfoot>
  </table>

  ${notes}

  <div class="no-print">
    <button type="button" onclick="window.print()">Печать / сохранить в PDF</button>
  </div>

  <script>
    window.addEventListener("load", function () {
      setTimeout(function () { window.print(); }, 150);
    });
  </script>
</body>
</html>`;
}

/** Открывает смету в новой вкладке и вызывает печать. Возвращает false без исключений вне браузера. */
export function printSpec(data: PrintData): boolean {
  try {
    const win = window.open("", "_blank", "width=900,height=1200");
    if (!win) return false;
    try {
      win.document.open();
      win.document.write(buildPrintHtml(data));
      win.document.close();
      win.focus();
      return true;
    } catch {
      try { win.close(); } catch { /* noop */ }
      return false;
    }
  } catch {
    return false;
  }
}
