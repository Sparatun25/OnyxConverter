// Движок PDF — рендер через pdf.js, упаковка многостраничного результата в zip.
import { loadScript, LIB } from "../util/load.js";
import { getQuality } from "../settings.js";

async function getPdfjs() {
    await loadScript(LIB.pdfjs);
    const lib = window.pdfjsLib;
    lib.GlobalWorkerOptions.workerSrc = LIB.pdfjsWorker;
    return lib;
}

// pdf -> png/jpg/webp. Одна страница -> картинка, много страниц -> zip.
export async function pdfToImages(file, to, onProgress) {
    const lib = await getPdfjs();
    const data = await file.arrayBuffer();
    const doc = await lib.getDocument({ data }).promise;
    const n = doc.numPages;
    const scale = 2; // ретина-чёткость
    const mime = to === "png" ? "image/png" : to === "webp" ? "image/webp" : "image/jpeg";
    const quality = to === "png" ? undefined : getQuality();
    const images = [];

    for (let i = 1; i <= n; i++) {
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (to === "jpg") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await new Promise((r) => canvas.toBlob(r, mime, quality));
        images.push(blob);
        onProgress?.(Math.round((i / n) * 90));
    }

    if (images.length === 1) {
        onProgress?.(100);
        return { blob: images[0], ext: to };
    }

    await loadScript(LIB.jszip);
    const zip = new window.JSZip();
    images.forEach((b, idx) => zip.file(`page-${String(idx + 1).padStart(2, "0")}.${to}`, b));
    const zipBlob = await zip.generateAsync({ type: "blob" });
    onProgress?.(100);
    return { blob: zipBlob, ext: "zip" };
}

// pdf -> txt (извлечение текстового слоя)
export async function pdfToText(file, onProgress) {
    const lib = await getPdfjs();
    const doc = await lib.getDocument({ data: await file.arrayBuffer() }).promise;
    let out = "";
    for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const tc = await page.getTextContent();
        out += tc.items.map((it) => it.str).join(" ") + "\n\n";
        onProgress?.(Math.round((i / doc.numPages) * 100));
    }
    return { blob: new Blob([out], { type: "text/plain;charset=utf-8" }), ext: "txt" };
}
