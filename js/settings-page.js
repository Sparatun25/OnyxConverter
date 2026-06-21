// Логика страницы настроек: переключатели темы и качества (стиль кобальта).
import { getSettings, setSetting } from "./settings.js";

function wireSwitcher(name) {
    const group = document.querySelector(`.switcher[data-setting="${name}"]`);
    if (!group) return;
    const current = getSettings()[name];
    group.querySelectorAll(".switch-btn").forEach((btn) => {
        if (btn.dataset.value === current) btn.classList.add("active");
        btn.addEventListener("click", () => {
            setSetting(name, btn.dataset.value);
            group.querySelectorAll(".switch-btn").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });
}

wireSwitcher("theme");
wireSwitcher("quality");
