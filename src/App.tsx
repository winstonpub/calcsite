import { useEffect, useState } from "react";
import Header from "./components/Header";
import ScrollTopButton from "./components/ScrollTopButton";
import MainPage from "./pages/MainPage";
import GrilyatoPage from "./pages/GrilyatoPage";
import ArmstrongPage from "./pages/ArmstrongPage";
import TestPage from "./pages/TestPage";
import SmetaPage from "./pages/SmetaPage";
import ArmstrongSmetaPage from "./pages/ArmstrongSmetaPage";
import TestSmetaPage from "./pages/TestSmetaPage";
import AdminPage from "./pages/AdminPage";
import RoofPage from "./pages/RoofPage";

/**
 * Роутинг по hash, чтобы сайт работал как статика на GitHub Pages.
 *  «#/» → Главная
 *  «#/grilyato» → калькулятор Грильято
 *  «#/armstrong» → страница Армстронг
 */
type PageRoute =
  | "/"
  | "/grilyato"
  | "/armstrong"
  | "/roof"
  | "/test"
  | "/smeta"
  | "/smeta-armstrong"
  | "/smeta-test"
  | "/admin";

function getLocation(): { route: PageRoute; anchor: string } {
  const rawHash = window.location.hash.replace(/^#/, "");
  const [rawPath = "", anchor = ""] = rawHash.split("#");

  if (rawPath.startsWith("/admin")) return { route: "/admin", anchor };
  if (rawPath.startsWith("/armstrong")) return { route: "/armstrong", anchor };
  if (rawPath.startsWith("/grilyato")) return { route: "/grilyato", anchor };
  if (rawPath.startsWith("/roof")) return { route: "/roof", anchor };
  if (rawPath.startsWith("/test")) return { route: "/test", anchor };
  // отдельные спецификации проверяем раньше общего «/smeta»
  if (rawPath.startsWith("/smeta-armstrong")) return { route: "/smeta-armstrong", anchor };
  if (rawPath.startsWith("/smeta-test")) return { route: "/smeta-test", anchor };
  if (rawPath.startsWith("/smeta-grilyato")) return { route: "/smeta", anchor };
  return { route: "/", anchor };
}

function useHashLocation() {
  const [location, setLocation] = useState(getLocation);

  useEffect(() => {
    const onHash = () => setLocation(getLocation());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return location;
}

export default function App() {
  const { route, anchor } = useHashLocation();

  useEffect(() => {
    const titles: Record<PageRoute, string> = {
      "/": "Главная - Лемана ПРО Челябинск",
      "/grilyato": "Грильято - Лемана ПРО Челябинск",
      "/armstrong": "Армстронг - Лемана ПРО Челябинск",
      "/roof": "Раскладка Кровля - Лемана ПРО Челябинск",
      "/test": "Тест - Лемана ПРО Челябинск",
      "/smeta": "Спецификация материалов Грильято - Лемана ПРО Челябинск",
      "/smeta-armstrong": "Спецификация материалов Армстронг - Лемана ПРО Челябинск",
      "/smeta-test": "Спецификация Материалов Тест - Лемана ПРО Челябинск",
      "/admin": "Администрирование - Лемана ПРО Челябинск",
    };
    document.title = titles[route];

    if (!anchor) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    const timer = window.setTimeout(() => {
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
    return () => window.clearTimeout(timer);
  }, [route, anchor]);

  return (
    <div className="min-h-screen bg-white">
      <Header route={route} />
      <main>
        {route === "/grilyato" && <GrilyatoPage />}
        {route === "/armstrong" && <ArmstrongPage />}
        {route === "/roof" && <RoofPage />}
        {route === "/test" && <TestPage />}
        {route === "/smeta" && <SmetaPage />}
        {route === "/smeta-armstrong" && <ArmstrongSmetaPage />}
        {route === "/smeta-test" && <TestSmetaPage />}
        {route === "/admin" && <AdminPage />}
        {route === "/" && <MainPage />}
      </main>
      <ScrollTopButton />
    </div>
  );
}
