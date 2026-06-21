// Генератор статического мультиязычного сайта.
// Из data/conversions.js + data/i18n.js создаёт на КАЖДОМ языке:
//   - главную, страницу под каждую конвертацию, /compress/, /settings/,
//     /about/, /privacy/, /terms/
//   - hreflang-связки между языками, sitemap.xml, robots.txt
// Язык по умолчанию (ru) — в корне, остальные — в /en/, /es/ и т.д.
// Запуск:  node build.js
import { writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FORMATS, CONVERSIONS, POPULAR, slugOf } from "./data/conversions.js";
import { LOCALES, DEFAULT_LOCALE, T, localePrefix, localeLabel } from "./data/i18n.js";

const ROOT = dirname(fileURLToPath(import.meta.url));

// ВАЖНО: поменяйте на свой домен перед публикацией.
const SITE = process.env.SITE_URL || "https://example.com";
const SITE_NAME = "Onyx";
const LOGO = "onyx";
const VERSION = Date.now(); // версия ассетов — сбрасывает кеш браузера при каждой пересборке
const mod = (p) => `<script type="module" src="${p}?v=${VERSION}"></script>`;

// ── Аналитика и Google Search Console ──
// Заполните, когда получите свои данные (или передайте через env при сборке).
// Plausible — приватная аналитика без cookie (рекомендуется, не нужен баннер согласия).
const PLAUSIBLE = process.env.PLAUSIBLE_DOMAIN || ""; // напр. "onyx.tools"
const GA_ID = process.env.GA_ID || "";                 // GA4, напр. "G-XXXXXXX"
const GSC_VERIFY = process.env.GSC_VERIFY || "";       // код подтверждения Search Console

function analyticsHead() {
    const parts = [];
    if (GSC_VERIFY) parts.push(`<meta name="google-site-verification" content="${GSC_VERIFY}" />`);
    if (PLAUSIBLE) parts.push(`<script defer data-domain="${PLAUSIBLE}" src="https://plausible.io/js/script.js"></script>`);
    if (GA_ID) parts.push(
        `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>` +
        `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');</script>`
    );
    return parts.join("\n");
}

const up = (s) => s.toUpperCase();
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const OG_LOCALE = { ru: "ru_RU", en: "en_US", es: "es_ES", pt: "pt_BR", de: "de_DE", fr: "fr_FR" };

// href внутри сайта с учётом языка: ('en','/png-to-jpg/') -> '/en/png-to-jpg/'
const href = (locale, path) => localePrefix(locale) + path;
// абсолютный URL
const url = (locale, path) => SITE + href(locale, path);

// ── котик-маскот (наш собственный) ──
function cat(small) {
    return `<svg class="cat${small ? " small" : ""}" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M60 122 C38 136 36 176 54 186 L146 186 C164 176 162 136 140 122" />
  <path d="M70 62 L60 24 L96 48 Z" />
  <path d="M130 62 L140 24 L104 48 Z" />
  <circle cx="100" cy="88" r="44" />
  <path d="M76 86 Q84 78 92 86" />
  <path d="M108 86 Q116 78 124 86" />
  <path d="M96 98 L100 102 L104 98" />
  <path d="M100 102 Q93 110 86 104" />
  <path d="M100 102 Q107 110 114 104" />
  <path d="M72 96 L46 90" />
  <path d="M72 102 L48 106" />
  <path d="M128 96 L154 90" />
  <path d="M128 102 L152 106" />
  <path d="M146 184 C182 182 184 142 160 140 C147 139 151 158 162 156" />
</svg>`;
}

const icons = {
    convert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h12M4 8l3-3M4 8l3 3"/><path d="M20 16H8m12 0l-3-3m3 3l-3 3"/></svg>`,
    settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    compress: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>`,
};

function sidebar(locale) {
    const u = T[locale].ui;
    return `<nav id="sidebar" aria-label="${esc(u.tabConvert)}">
  <a class="sidebar-logo" href="${href(locale, "/")}">${LOGO}</a>
  <a class="sidebar-tab" data-section="convert" href="${href(locale, "/")}">${icons.convert}<span>${esc(u.tabConvert)}</span></a>
  <a class="sidebar-tab" data-section="compress" href="${href(locale, "/compress/")}">${icons.compress}<span>${esc(u.tabCompress)}</span></a>
  <div class="sidebar-spacer"></div>
  <a class="sidebar-tab" data-section="settings" href="${href(locale, "/settings/")}">${icons.settings}<span>${esc(u.tabSettings)}</span></a>
  <a class="sidebar-tab" data-section="about" href="${href(locale, "/about/")}">${icons.info}<span>${esc(u.tabAbout)}</span></a>
</nav>`;
}

// футер: переключатель языков + ссылки на политики (для AdSense)
function footer(locale, path) {
    const u = T[locale].ui;
    const langs = LOCALES.map((l) =>
        `<a class="lang-link${l === locale ? " active" : ""}" href="${href(l, path)}" hreflang="${l}">${localeLabel(l)}</a>`
    ).join("");
    const policies =
        `<a href="${href(locale, "/about/")}">${esc(u.tabAbout)}</a>` +
        `<a href="${href(locale, "/privacy/")}">${esc(u.privacyTitle)}</a>` +
        `<a href="${href(locale, "/terms/")}">${esc(u.termsTitle)}</a>`;
    return `<footer class="site-footer">
  <div class="footer-langs">${langs}</div>
  <div class="footer-links">${policies}</div>
  <div class="footer-copy">© ${new Date().getFullYear()} ${SITE_NAME}</div>
</footer>`;
}

// строки UI, которые нужны JS-виджетам (конвертер и сжатие)
function jsStrings(locale) {
    const u = T[locale].ui;
    return {
        drop: u.drop, dropSub: u.dropSub, dropFixed: u.dropFixed,
        process: u.process, download: u.download, again: u.again, clear: u.clear,
        processing: u.processing, loadingEngine: u.loadingEngine, error: u.error,
        cat: u.cat,
        dropImg: u.dropImg, dropImgSub: u.dropImgSub,
        cFormat: u.cFormat, cQuality: u.cQuality, cMaxWidth: u.cMaxWidth, cAsIs: u.cAsIs,
        cResolution: u.cResolution, cResLow: u.cResLow, cResMed: u.cResMed, cResHigh: u.cResHigh,
        cDo: u.cDo, cing: u.cing, cAgain: u.cAgain,
        inDev: u.inDev, inDevSub: u.inDevSub, cSavedLabel: u.cSavedLabel, cWas: u.cWas, cNow: u.cNow,
    };
}

function layout({ locale, title, description, path, content, jsonLd = [], extraScript = "" }) {
    const canonical = url(locale, path);
    const ld = jsonLd.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n");
    const alternates = LOCALES.map((l) => `<link rel="alternate" hreflang="${l}" href="${url(l, path)}" />`).join("\n") +
        `\n<link rel="alternate" hreflang="x-default" href="${url("en", path)}" />`;
    const onyx = `<script>window.ONYX=${JSON.stringify({ locale, t: jsStrings(locale) })};</script>`;
    return `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${canonical}" />
${alternates}
<meta property="og:type" content="website" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${canonical}" />
<meta property="og:site_name" content="${SITE_NAME}" />
<meta property="og:locale" content="${OG_LOCALE[locale] || "en_US"}" />
<meta name="twitter:card" content="summary" />
${analyticsHead()}
<link rel="icon" href="/img/favicon.svg" type="image/svg+xml" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/css/style.css?v=${VERSION}" />
<script>try{var s=localStorage.getItem('convert-settings');var t=s?JSON.parse(s).theme:'auto';var d=t==='dark'||((!t||t==='auto')&&matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');}catch(e){}</script>
${onyx}
${ld}
</head>
<body>
<div id="app">
${sidebar(locale)}
<main id="content">
${content}
${footer(locale, path)}
</main>
</div>
${mod("/js/main.js")}
${extraScript}
</body>
</html>`;
}

// ── главная ──
function homePage(locale) {
    const s = T[locale].seo, u = T[locale].ui;
    const popularGrid = POPULAR.map((slug) => {
        const c = CONVERSIONS.find((x) => slugOf(x) === slug);
        return c ? `<a class="popular-link" href="${href(locale, "/" + slug + "/")}">${up(c.from)} → ${up(c.to)}</a>` : "";
    }).join("\n");

    const content = `<div class="page">
  ${cat(false)}
  <h1 class="title">${esc(u.homeH1)}</h1>
  <p class="subtitle">${esc(u.tagline)}</p>
  <div class="converter" id="converter"></div>
  <div class="popular">
    <p class="popular-title">${esc(u.popular)}</p>
    <div class="popular-grid">
${popularGrid}
    </div>
  </div>
  <p class="footnote">${esc(u.footnote)}</p>
</div>`;

    const jsonLd = [
        { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: url(locale, "/") },
        {
            "@context": "https://schema.org", "@type": "WebApplication", name: SITE_NAME, url: url(locale, "/"),
            applicationCategory: "UtilitiesApplication", operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
    ];

    return layout({
        locale, title: s.homeTitle, description: s.homeDesc, path: "/",
        content, jsonLd, extraScript: mod("/js/converter.js"),
    });
}

// ── страница конвертации ──
function conversionPage(c, locale) {
    const s = T[locale].seo, u = T[locale].ui;
    const F = FORMATS[c.from].name, To = FORMATS[c.to].name;
    const slug = slugOf(c);
    const path = "/" + slug + "/";

    const steps = s.steps(F, To).map((x) => `<li>${esc(x)}</li>`).join("\n");
    const faqArr = s.faq(F, To);
    const faq = faqArr.map((f) => `<div class="faq-item"><p class="faq-q">${esc(f.q)}</p><p class="faq-a">${esc(f.a)}</p></div>`).join("\n");
    const why = u.why.map((x) => `<li>${x}</li>`).join("\n");

    const related = CONVERSIONS
        .filter((x) => slugOf(x) !== slug && (x.from === c.from || x.to === c.to))
        .slice(0, 6)
        .map((x) => `<a href="${href(locale, "/" + slugOf(x) + "/")}">${up(x.from)} → ${up(x.to)}</a>`)
        .join("\n");

    const content = `<div class="page">
  <div class="breadcrumb"><a href="${href(locale, "/")}">${esc(u.homeCrumb)}</a> / ${up(c.from)} → ${up(c.to)}</div>
  ${cat(true)}
  <h1 class="title">${esc(s.h1(F, To))}</h1>
  <p class="subtitle">${esc(s.intro(F, To))}</p>
  <div class="converter" id="converter" data-from="${c.from}" data-to="${c.to}"></div>
  <div class="long-text">
    <h2>${esc(u.howTo.replace("{F}", up(c.from)).replace("{T}", up(c.to)))}</h2>
    <ol>
${steps}
    </ol>
    <h2>${esc(u.whyTitle)}</h2>
    <ul>
${why}
    </ul>
    <h2>${esc(u.faqTitle)}</h2>
${faq}
    <h2>${esc(u.relatedTitle)}</h2>
    <div class="related-links">
${related}
    </div>
  </div>
  <p class="footnote">${esc(u.footnote)}</p>
</div>`;

    const jsonLd = [
        { "@context": "https://schema.org", "@type": "HowTo", name: s.h1(F, To),
          step: s.steps(F, To).map((x, i) => ({ "@type": "HowToStep", position: i + 1, text: x })) },
        { "@context": "https://schema.org", "@type": "FAQPage",
          mainEntity: faqArr.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: u.homeCrumb, item: url(locale, "/") },
            { "@type": "ListItem", position: 2, name: `${up(c.from)} → ${up(c.to)}`, item: url(locale, path) },
          ] },
    ];

    return layout({
        locale, title: s.title(F, To) + " — " + SITE_NAME, description: s.desc(F, To), path,
        content, jsonLd, extraScript: mod("/js/converter.js"),
    });
}

// ── настройки ──
function settingsPage(locale) {
    const s = T[locale].seo, u = T[locale].ui;
    const content = `<div class="page">
  <h1 class="title">${esc(u.settingsTitle)}</h1>
  <div class="settings-section">
    <div class="settings-heading">${esc(u.theme)}</div>
    <div class="switcher" data-setting="theme">
      <button class="switch-btn" data-value="auto">${esc(u.themeAuto)}</button>
      <button class="switch-btn" data-value="light">${esc(u.themeLight)}</button>
      <button class="switch-btn" data-value="dark">${esc(u.themeDark)}</button>
    </div>
  </div>
  <div class="settings-section">
    <div class="settings-heading">${esc(u.quality)}</div>
    <div class="switcher" data-setting="quality">
      <button class="switch-btn" data-value="normal">${esc(u.qNormal)}</button>
      <button class="switch-btn" data-value="high">${esc(u.qHigh)}</button>
      <button class="switch-btn" data-value="max">${esc(u.qMax)}</button>
    </div>
    <div class="settings-desc">${esc(u.qualityDesc)}</div>
  </div>
</div>`;
    return layout({
        locale, title: s.settingsTitle, description: s.settingsDesc, path: "/settings/",
        content, extraScript: mod("/js/settings-page.js"),
    });
}

// ── сжатие ──
function compressPage(locale) {
    const s = T[locale].seo, u = T[locale].ui;
    const how = u.compHow.map((x) => `<li>${esc(x)}</li>`).join("\n");
    const content = `<div class="page">
  <h1 class="title">${esc(u.compressTitle)}</h1>
  <p class="subtitle">${esc(u.compressSub)}</p>
  <div class="compressor" id="compressor"></div>
  <div class="long-text">
    <h2>${esc(u.compHowTitle)}</h2>
    <ol>
${how}
    </ol>
  </div>
  <p class="footnote">${esc(u.footnote)}</p>
</div>`;
    return layout({
        locale, title: s.compressTitle, description: s.compressDesc, path: "/compress/",
        content, extraScript: mod("/js/compress.js"),
    });
}

// ── о проекте / политики (простые текстовые страницы) ──
function textPage(locale, { titleKey, bodyKey, seoTitle, seoDesc, path, showCat }) {
    const u = T[locale].ui, s = T[locale].seo;
    const body = u[bodyKey].map((p) => `<p>${p}</p>`).join("\n");
    const content = `<div class="page">
  ${showCat ? cat(true) : ""}
  <h1 class="title">${esc(u[titleKey])}</h1>
  <div class="long-text">
${body}
  </div>
</div>`;
    return layout({ locale, title: s[seoTitle], description: s[seoDesc], path, content });
}

// ── sitemap и robots ──
function sitemap() {
    const paths = ["/", "/compress/", "/settings/", "/about/", "/privacy/", "/terms/", ...CONVERSIONS.map((c) => "/" + slugOf(c) + "/")];
    const body = [];
    for (const p of paths) {
        for (const l of LOCALES) {
            const alts = LOCALES.map((al) => `<xhtml:link rel="alternate" hreflang="${al}" href="${url(al, p)}"/>`).join("");
            body.push(`  <url><loc>${url(l, p)}</loc>${alts}</url>`);
        }
    }
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body.join("\n")}\n</urlset>\n`;
}

const robots = () => `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`;

// ── запись файлов ──
function write(rel, html) {
    const path = join(ROOT, rel);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, html, "utf-8");
}

// чистим прошлую генерацию
const rootDirs = ["compress", "settings", "about", "privacy", "terms", ...CONVERSIONS.map((c) => slugOf(c))];
for (const l of LOCALES) {
    if (l === DEFAULT_LOCALE) {
        for (const d of rootDirs) { const p = join(ROOT, d); if (existsSync(p)) rmSync(p, { recursive: true, force: true }); }
    } else {
        const p = join(ROOT, l); if (existsSync(p)) rmSync(p, { recursive: true, force: true });
    }
}

let count = 0;
for (const locale of LOCALES) {
    const base = locale === DEFAULT_LOCALE ? "" : locale + "/";
    write(base + "index.html", homePage(locale));
    write(base + "compress/index.html", compressPage(locale));
    write(base + "settings/index.html", settingsPage(locale));
    write(base + "about/index.html", textPage(locale, { titleKey: "aboutTitle", bodyKey: "about", seoTitle: "aboutTitle", seoDesc: "aboutDesc", path: "/about/", showCat: true }));
    write(base + "privacy/index.html", textPage(locale, { titleKey: "privacyTitle", bodyKey: "privacy", seoTitle: "privacyTitle", seoDesc: "privacyDesc", path: "/privacy/" }));
    write(base + "terms/index.html", textPage(locale, { titleKey: "termsTitle", bodyKey: "terms", seoTitle: "termsTitle", seoDesc: "termsDesc", path: "/terms/" }));
    for (const c of CONVERSIONS) { write(base + slugOf(c) + "/index.html", conversionPage(c, locale)); count++; }
}
writeFileSync(join(ROOT, "sitemap.xml"), sitemap(), "utf-8");
writeFileSync(join(ROOT, "robots.txt"), robots(), "utf-8");

console.log(`Готово: ${LOCALES.length} языков × (${CONVERSIONS.length} конвертаций + 6 страниц) = ${count + LOCALES.length * 6} страниц + sitemap/robots.`);
