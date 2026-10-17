import Calculator from "../components/Calculator";
import SiteFooter from "../components/SiteFooter";

/** Тестовая страница: копия калькулятора со страницы «Грильято». */
export default function TestPage() {
  return (
    <>
      <Calculator showPlan={false} showTableTotal={false} printHref="#/smeta" mode="armstrong" />
      <SiteFooter />
    </>
  );
}
