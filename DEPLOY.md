# Деплой Onyx

Сайт статический: генерируется командой `node build.js` и публикуется как обычные файлы.
Перед публикацией укажите домен (см. ниже) и пересоберите.

## 0. Указать домен
В `build.js` поменяйте `SITE = "https://example.com"` на ваш домен
(или задайте переменную окружения `SITE_URL` при сборке). От этого зависят
canonical/hreflang/sitemap — для SEO важно, чтобы домен был правильный.

---

## Вариант A. Cloudflare Pages (рекомендуется, бесплатно)
1. Залейте папку `converter` в репозиторий GitHub (или GitLab).
2. На dash.cloudflare.com → **Workers & Pages → Create → Pages → Connect to Git**.
3. Выберите репозиторий. Настройки сборки:
   - **Build command:** `node build.js`
   - **Build output directory:** `/` (корень)
4. (Опц.) В **Settings → Environment variables** добавьте:
   `SITE_URL`, `PLAUSIBLE_DOMAIN`, `GA_ID`, `GSC_VERIFY`.
5. **Save and Deploy**. Через ~1 мин сайт будет на `*.pages.dev`.
6. Привяжите свой домен в **Custom domains**.

`.wasm` (ffmpeg ~32 МБ) и `_headers` Cloudflare отдаёт корректно из коробки.

## Вариант B. Netlify (бесплатно)
1. Репозиторий на GitHub.
2. app.netlify.com → **Add new site → Import from Git** → выберите репозиторий.
   Build command и publish уже заданы в `netlify.toml` (`node build.js`, `.`).
3. (Опц.) **Site settings → Environment variables**: `SITE_URL`, `PLAUSIBLE_DOMAIN`, `GA_ID`, `GSC_VERIFY`.
4. **Deploy**. Затем привяжите свой домен.

## Без Git (быстрый тест)
Можно перетащить папку `converter` целиком в окно деплоя Netlify Drop
(app.netlify.com/drop) — но тогда сборка не запустится, поэтому сначала
выполните `node build.js` локально, чтобы HTML был готов.

---

## Аналитика и Google Search Console
Включаются автоматически, как только заданы переменные (в коде или env), и тогда
попадают во все страницы (`build.js → analyticsHead`).

- **Plausible** (приватная, без cookie, без баннера согласия — рекомендуется):
  заведите сайт на plausible.io, задайте `PLAUSIBLE_DOMAIN` = ваш домен.
- **Google Analytics 4**: создайте поток данных, задайте `GA_ID` = `G-XXXXXXX`.
  (использует cookie — в ЕС понадобится баннер согласия).
- **Google Search Console** (search.google.com/search-console):
  добавьте ресурс по домену, выберите способ «HTML-тег», скопируйте `content`
  из мета-тега в `GSC_VERIFY`, пересоберите, задеплойте, нажмите «Подтвердить».
  Затем отправьте `https://ВАШ-ДОМЕН/sitemap.xml` в разделе Sitemaps.
