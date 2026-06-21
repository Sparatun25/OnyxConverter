// Движок изображений. Растровые форматы — нативный Canvas (быстро, без библиотек).
// HEIC — через heic2any (браузер не умеет HEIC сам).
import { loadScript, LIB } from "../util/load.js";
import { getQuality } from "../settings.js";

export const MIME = { png: "image/png", jpg: "image/jpeg", webp: "image/webp" };

// Декодируем файл в нечто рисуемое на canvas. Возвращаем { img, width, height }.
async function decode(file) {
    const isSvg = file.type === "image/svg+xml" || /\.svg$/i.test(file.name);
    if (!isSvg && "createImageBitmap" in window) {
        try {
            const b = await createImageBitmap(file);
            return { img: b, width: b.width, height: b.height };
        } catch (_) { /* запасной путь ниже */ }
    }
    const url = URL.createObjectURL(file);
    const img = await new Promise((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = () => rej(new Error("не удалось прочитать изображение"));
        i.src = url;
    });
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    return {
        img,
        width: img.naturalWidth || img.width || 1024,
        height: img.naturalHeight || img.height || 768,
    };
}

function drawToCanvas(decoded, withWhiteBg) {
    const canvas = document.createElement("canvas");
    canvas.width = decoded.width;
    canvas.height = decoded.height;
    const ctx = canvas.getContext("2d");
    if (withWhiteBg) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(decoded.img, 0, 0, canvas.width, canvas.height);
    return canvas;
}

// изображение -> png/jpg/webp (png, jpg, webp, bmp, gif, svg, avif на входе)
export async function rasterConvert(file, to, onProgress) {
    onProgress?.(10);
    const decoded = await decode(file);
    onProgress?.(45);
    const canvas = drawToCanvas(decoded, to === "jpg"); // jpg без прозрачности -> белый фон
    onProgress?.(70);
    const quality = to === "png" ? undefined : getQuality();
    const blob = await new Promise((res) => canvas.toBlob(res, MIME[to], quality));
    if (!blob) throw new Error("браузер не смог сохранить в этот формат");
    onProgress?.(100);
    return { blob, ext: to };
}

// HEIC -> jpg/png (фото iPhone)
export async function heicConvert(file, to, onProgress) {
    onProgress?.(10);
    await loadScript(LIB.heic2any);
    onProgress?.(30);
    const out = await window.heic2any({
        blob: file,
        toType: to === "png" ? "image/png" : "image/jpeg",
        quality: getQuality(),
    });
    const blob = Array.isArray(out) ? out[0] : out;
    onProgress?.(100);
    return { blob, ext: to };
}

// изображение -> pdf (одна страница по размеру картинки)
export async function imageToPdf(file, onProgress) {
    onProgress?.(10);
    await loadScript(LIB.pdfLib);
    const { PDFDocument } = window.PDFLib;
    const decoded = await decode(file);
    const canvas = drawToCanvas(decoded, false);
    const pngBytes = await (await new Promise((r) => canvas.toBlob(r, "image/png"))).arrayBuffer();
    onProgress?.(50);
    const pdf = await PDFDocument.create();
    const img = await pdf.embedPng(pngBytes);
    const page = pdf.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    const bytes = await pdf.save();
    onProgress?.(100);
    return { blob: new Blob([bytes], { type: "application/pdf" }), ext: "pdf" };
}
