// ============================================================
//  ЕДИНАЯ ТОЧКА ВХОДА ДЛЯ ВСЕХ КОНВЕРТАЦИЙ
//
//  Интерфейс общается ТОЛЬКО с convert(). Где идёт обработка —
//  в браузере или на сервере — ему не важно.
//
//  Сейчас MODE = 'client'. Чтобы перейти на сервер (для тяжёлых форматов
//  вроде PDF -> Word), переключите MODE на 'server' и реализуйте ветку ниже.
//  Остальной код сайта менять НЕ нужно.
// ============================================================
import { CONVERSIONS } from "../data/conversions.js";
import { rasterConvert, heicConvert, imageToPdf } from "./engines/image.js";
import { pdfToImages, pdfToText } from "./engines/pdf.js";
import { docxToPdf, docxToText, docxToHtml } from "./engines/docx.js";
import { mdToHtml, txtToPdf } from "./engines/text.js";
import { mediaConvert } from "./engines/media.js";

export const MODE = "client"; // 'client' | 'server'

const RASTER_IN = ["png", "jpg", "webp", "bmp", "gif", "svg", "avif"];
const RASTER_OUT = ["png", "jpg", "webp"];
const MEDIA_IN = ["mp3", "wav", "ogg", "m4a", "flac", "aac", "mp4", "mov", "webm", "avi", "mkv"];

// Подбираем обработчик для пары форматов.
function handlerFor(from, to) {
    if (from === "heic" && (to === "jpg" || to === "png")) return (f, p) => heicConvert(f, to, p);
    if (RASTER_IN.includes(from) && RASTER_OUT.includes(to)) return (f, p) => rasterConvert(f, to, p);
    if (RASTER_IN.includes(from) && to === "pdf") return (f, p) => imageToPdf(f, p);
    if (from === "pdf" && RASTER_OUT.includes(to)) return (f, p) => pdfToImages(f, to, p);
    if (from === "pdf" && to === "txt") return pdfToText;
    if (from === "docx" && to === "pdf") return docxToPdf;
    if (from === "docx" && to === "txt") return docxToText;
    if (from === "docx" && to === "html") return docxToHtml;
    if (from === "md" && to === "html") return mdToHtml;
    if (from === "txt" && to === "pdf") return txtToPdf;
    if (MEDIA_IN.includes(from)) return (f, p) => mediaConvert(f, from, to, p); // аудио/видео
    return null;
}

// Реестр строим из общего списка CONVERSIONS, чтобы он не расходился с SEO-страницами.
const registry = {};
for (const { from, to } of CONVERSIONS) {
    const run = handlerFor(from, to);
    if (run) (registry[from] ||= {})[to] = run;
}

export function normExt(ext) {
    ext = (ext || "").toLowerCase().replace(/^\./, "");
    if (ext === "jpeg") return "jpg";
    if (ext === "tif") return "tiff";
    if (ext === "markdown") return "md";
    if (ext === "heif") return "heic";
    return ext;
}

export const sourceFormats = () => Object.keys(registry);
export function targetsFor(ext) {
    const e = normExt(ext);
    return registry[e] ? Object.keys(registry[e]) : [];
}

// ── единая функция конвертации → { blob, ext } ──
export async function convert(file, from, to, onProgress = () => {}) {
    from = normExt(from);
    to = normExt(to);

    if (MODE === "server") {
        // ── БУДУЩЕЕ: серверная обработка. UI трогать не нужно. ──
        // const fd = new FormData();
        // fd.append("file", file);
        // const res = await fetch(`/api/convert?from=${from}&to=${to}`, { method: "POST", body: fd });
        // if (!res.ok) throw new Error("сервер вернул ошибку");
        // return { blob: await res.blob(), ext: to };
        throw new Error("серверный режим ещё не настроен");
    }

    const run = registry[from]?.[to];
    if (!run) throw new Error(`конвертация ${from} → ${to} пока не поддерживается`);
    return run(file, onProgress);
}
