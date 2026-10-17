import { useCallback } from "react";
import Hero from "../components/Hero";
import Calculator from "../components/Calculator";
import Sections from "../components/Sections";

/** Страница отдельного калькулятора потолка Грильято. */
export default function GrilyatoPage() {
  const scrollToCalc = useCallback(() => {
    document.getElementById("calc")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      <Hero onStart={scrollToCalc} />
      <Calculator showPlan={false} showTableTotal={false} printHref="#/smeta" />
      <Sections />
    </>
  );
}