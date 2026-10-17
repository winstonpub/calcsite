import { useEffect, useState } from "react";
import Header from "./components/Header";
import MainPage from "./pages/MainPage";
import GrilyatoPage from "./pages/GrilyatoPage";
import ArmstrongPage from "./pages/ArmstrongPage";
import TestPage from "./pages/TestPage";
import SmetaPage from "./pages/SmetaPage";

/**
 * Роутинг по hash, чтобы сайт работал как статика на GitHub Pages.
 *  «#/» → Главная
 *  «#/grilyato» → калькулятор Грильято
 *  «#/armstrong» → страница Армстронг
 */
type PageRoute = "/" | "/grilyato" | "/armstrong" | "/test" | "/smeta";

function getLocation(): { route: PageRoute; anchor: string } {
  const rawHash = window.location.hash.replace(/^#/, "");
  const [rawPath = "", anchor = ""] = rawHash.split("#");

  if (rawPath.startsWith("/armstrong")) return { route: "/armstrong", anchor };
  if (rawPath.startsWith("/grilyato")) return { route: "/grilyato", anchor };
  if (rawPath.startsWith("/test")) return { route: "/test", anchor };
  if (rawPath.startsWith("/smeta")) return { route: "/smeta", anchor };
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
      "/test": "Тест - Лемана ПРО Челябинск",
      "/smeta": "Спецификация материалов Грильято - Лемана ПРО Челябинск",
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
        {route === "/test" && <TestPage />}
        {route === "/smeta" && <SmetaPage />}
        {route === "/" && <MainPage />}
      </main>
    </div>
  );
}
