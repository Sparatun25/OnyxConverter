// Настройки сайта: тема и качество. Хранятся в localStorage.
const KEY = "convert-settings";
const defaults = { theme: "auto", quality: "high" };

export function getSettings() {
    try {
        return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
    } catch (_) {
        return { ...defaults };
    }
}

export function setSetting(key, value) {
    const s = getSettings();
    s[key] = value;
    localStorage.setItem(KEY, JSON.stringify(s));
    if (key === "theme") applyTheme();
}

// Качество для JPG/WEBP-сжатия
export function getQuality() {
    const q = getSettings().quality;
    return q === "max" ? 1.0 : q === "normal" ? 0.8 : 0.92;
}

export function applyTheme() {
    const t = getSettings().theme;
    const dark =
        t === "dark" ||
        (t === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
}
