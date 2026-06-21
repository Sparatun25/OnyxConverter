// Общая инициализация: тема и активная вкладка в боковой панели.
import { getSettings, applyTheme } from "./settings.js";

applyTheme();

// Если тема «авто» — реагируем на смену системной темы
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (getSettings().theme === "auto") applyTheme();
});

// Определяем раздел по пути (с учётом языкового префикса) и подсвечиваем вкладку
const locale = (window.ONYX && window.ONYX.locale) || "ru";
let p = location.pathname;
if (locale !== "ru" && (p === "/" + locale || p.startsWith("/" + locale + "/"))) {
    p = p.slice(("/" + locale).length) || "/";
}
let section = "convert";
if (p.startsWith("/compress")) section = "compress";
else if (p.startsWith("/settings")) section = "settings";
else if (p.startsWith("/about") || p.startsWith("/privacy") || p.startsWith("/terms")) section = "about";

document.querySelectorAll(".sidebar-tab").forEach((tab) => {
    if (tab.dataset.section === section) tab.classList.add("active");
});
