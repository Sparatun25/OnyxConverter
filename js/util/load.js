// Ленивая подгрузка внешних библиотек (UMD) по требованию.
// Грузим только ту библиотеку, которая реально нужна для конкретной конвертации,
// чтобы стартовая страница оставалась лёгкой и быстрой.

const cache = {};

export function loadScript(src) {
    if (cache[src]) return cache[src];
    cache[src] = new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("не удалось загрузить библиотеку: " + src));
        document.head.appendChild(s);
    });
    return cache[src];
}

// CDN-адреса библиотек в одном месте.
// На продакшене их стоит положить к себе (быстрее и не зависим от чужого CDN).
export const LIB = {
    pdfLib: "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js",
    pdfjs: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js",
    pdfjsWorker: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js",
    jszip: "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js",
    jspdf: "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js",
    html2canvas: "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js",
    mammoth: "https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js",
    heic2any: "https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js",
    marked: "https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js",
    // ffmpeg.wasm — однопоточный core (не требует COOP/COEP).
    // Размещён локально (/vendor): cross-origin Worker из CDN браузер блокирует.
    ffmpeg: "/vendor/ffmpeg/ffmpeg.js",
    ffmpegWorker: "/vendor/ffmpeg/814.ffmpeg.js",
    ffmpegCore: "/vendor/ffmpeg/ffmpeg-core.js",
    ffmpegWasm: "/vendor/ffmpeg/ffmpeg-core.wasm",
};
