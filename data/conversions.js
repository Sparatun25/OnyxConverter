// ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ о форматах и конвертациях.
// Используется и в браузере (js/convert.js — маршрутизация),
// и в Node (build.js — генерация SEO-страниц и sitemap).
// Здесь НЕТ кода, зависящего от браузера, чтобы файл работал в обоих средах.

export const FORMATS = {
    // фото
    png:  { name: "PNG",  kind: "фото",     about: "растровый формат с поддержкой прозрачности" },
    jpg:  { name: "JPG",  kind: "фото",     about: "сжатый формат фотографий (JPEG)" },
    webp: { name: "WEBP", kind: "фото",     about: "современный формат Google с малым весом" },
    heic: { name: "HEIC", kind: "фото",     about: "формат фотографий iPhone" },
    avif: { name: "AVIF", kind: "фото",     about: "новый формат с сильным сжатием" },
    bmp:  { name: "BMP",  kind: "фото",     about: "несжатый растровый формат" },
    gif:  { name: "GIF",  kind: "фото",     about: "формат с анимацией (берётся первый кадр)" },
    svg:  { name: "SVG",  kind: "фото",     about: "векторная графика" },
    // документы
    pdf:  { name: "PDF",  kind: "документ", about: "формат документов" },
    txt:  { name: "TXT",  kind: "документ", about: "обычный текст" },
    docx: { name: "DOCX", kind: "документ", about: "документ Microsoft Word" },
    html: { name: "HTML", kind: "документ", about: "веб-страница" },
    md:   { name: "MD",   kind: "документ", about: "разметка Markdown" },
    // аудио
    mp3:  { name: "MP3",  kind: "аудио",    about: "сжатое аудио MP3" },
    wav:  { name: "WAV",  kind: "аудио",    about: "несжатое аудио WAV" },
    ogg:  { name: "OGG",  kind: "аудио",    about: "аудио OGG" },
    m4a:  { name: "M4A",  kind: "аудио",    about: "аудио M4A (AAC)" },
    flac: { name: "FLAC", kind: "аудио",    about: "аудио без потерь FLAC" },
    aac:  { name: "AAC",  kind: "аудио",    about: "аудио AAC" },
    // видео
    mp4:  { name: "MP4",  kind: "видео",    about: "видео MP4" },
    mov:  { name: "MOV",  kind: "видео",    about: "видео QuickTime (MOV)" },
    webm: { name: "WEBM", kind: "видео",    about: "видео WebM" },
    avi:  { name: "AVI",  kind: "видео",    about: "видео AVI" },
    mkv:  { name: "MKV",  kind: "видео",    about: "видео MKV" },
};

// Категории для переключателя на главной (в порядке отображения).
export const CATEGORIES = [
    { id: "фото",     label: "фото" },
    { id: "документ", label: "документы" },
    { id: "аудио",    label: "аудио" },
    { id: "видео",    label: "видео" },
];

// Все поддерживаемые маршруты (только client-side).
export const CONVERSIONS = [
    // изображения → изображения / pdf
    { from: "png",  to: "jpg"  }, { from: "png",  to: "webp" }, { from: "png",  to: "pdf" },
    { from: "jpg",  to: "png"  }, { from: "jpg",  to: "webp" }, { from: "jpg",  to: "pdf" },
    { from: "webp", to: "png"  }, { from: "webp", to: "jpg"  }, { from: "webp", to: "pdf" },
    { from: "heic", to: "jpg"  }, { from: "heic", to: "png"  },
    { from: "avif", to: "jpg"  }, { from: "avif", to: "png"  }, { from: "avif", to: "webp" },
    { from: "bmp",  to: "png"  }, { from: "bmp",  to: "jpg"  },
    { from: "gif",  to: "png"  }, { from: "gif",  to: "jpg"  },
    { from: "svg",  to: "png"  }, { from: "svg",  to: "jpg"  },
    // pdf →
    { from: "pdf",  to: "jpg"  }, { from: "pdf",  to: "png"  }, { from: "pdf", to: "txt" },
    // документы →
    { from: "docx", to: "pdf"  }, { from: "docx", to: "txt"  }, { from: "docx", to: "html" },
    { from: "md",   to: "html" },
    { from: "txt",  to: "pdf"  },
    // аудио → (ffmpeg.wasm). mp3/wav надёжны; ogg (libvorbis) в этой сборке падает — исключён.
    { from: "mp3",  to: "wav"  }, { from: "wav",  to: "mp3"  }, { from: "m4a", to: "mp3" },
    { from: "ogg",  to: "mp3"  }, { from: "flac", to: "mp3"  }, { from: "aac", to: "mp3" },
    { from: "flac", to: "wav"  }, { from: "m4a",  to: "wav"  },
    // видео → (ffmpeg.wasm). mp4 (x264) и gif работают; webm (libvpx) в этой сборке падает — исключён.
    { from: "mov",  to: "mp4"  }, { from: "webm", to: "mp4"  }, { from: "avi", to: "mp4" },
    { from: "mkv",  to: "mp4"  }, { from: "mp4",  to: "gif" },
    { from: "mp4",  to: "mp3"  }, { from: "mov",  to: "mp3"  }, { from: "webm", to: "mp3" },
];

export const slugOf = (c) => `${c.from}-to-${c.to}`;

// Генератор SEO-контента для страницы конкретной конвертации.
export function pageData(c) {
    const f = FORMATS[c.from];
    const t = FORMATS[c.to];
    const F = f.name, T = t.name;
    return {
        from: c.from,
        to: c.to,
        slug: slugOf(c),
        title: `${F} в ${T} — конвертировать онлайн бесплатно`,
        h1: `Конвертер ${F} в ${T}`,
        description: `Конвертируйте ${F} в ${T} онлайн и бесплатно. Без регистрации и без загрузки на сервер — файл обрабатывается прямо в браузере. Быстро, безопасно, без водяных знаков.`,
        intro: `Бесплатный онлайн-конвертер ${F} в ${T}. Просто выберите файл — мы преобразуем ${f.about} в ${t.about} прямо в вашем браузере. Файлы никуда не загружаются и не сохраняются на сервере.`,
        steps: [
            `Перетащите файл ${F} в окно или нажмите «выбрать файл».`,
            `Нажмите кнопку «обработать» — конвертация займёт пару секунд.`,
            `Скачайте готовый файл ${T}.`,
        ],
        faq: [
            {
                q: `Как конвертировать ${F} в ${T}?`,
                a: `Откройте эту страницу, выберите или перетащите файл ${F}, нажмите «обработать» и скачайте результат в формате ${T}. Всё происходит прямо в браузере.`,
            },
            {
                q: `Конвертация ${F} в ${T} бесплатна?`,
                a: `Да, полностью бесплатно и без ограничений по количеству файлов. Регистрация не нужна.`,
            },
            {
                q: `Мои файлы в безопасности?`,
                a: `Да. Файлы не отправляются на сервер — обработка идёт локально в вашем браузере, поэтому документы и фото остаются только у вас.`,
            },
            {
                q: `Есть ли водяные знаки или лимит на размер?`,
                a: `Нет водяных знаков. Размер ограничен только возможностями вашего устройства, так как всё считается на вашем компьютере.`,
            },
        ],
    };
}

// Популярные конвертации для главной и внутренней перелинковки (важно для SEO).
export const POPULAR = [
    "heic-to-jpg", "png-to-jpg", "jpg-to-png", "webp-to-png",
    "pdf-to-jpg", "jpg-to-pdf", "docx-to-pdf", "mp4-to-mp3",
    "mov-to-mp4", "png-to-webp",
];
