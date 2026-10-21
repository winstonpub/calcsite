import { useCallback, useEffect } from "react";

/**
 * Подключает режим печати текущей страницы спецификации.
 * CSS оставляет один лист от заголовка до строки «Итого материалы».
 */
export function useSpecificationPagePrint() {
  useEffect(() => {
    document.body.classList.add("spec-print-active");
    return () => document.body.classList.remove("spec-print-active");
  }, []);

  return useCallback(() => {
    // Название вкладки иначе попадает в стандартный верхний колонтитул браузера.
    const originalTitle = document.title;
    document.title = " ";

    const restore = () => {
      document.title = originalTitle;
      window.removeEventListener("afterprint", restore);
    };

    window.addEventListener("afterprint", restore);
    window.print();
    // Резерв для браузеров, которые не отправляют afterprint.
    window.setTimeout(restore, 1000);
  }, []);
}