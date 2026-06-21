// Движок документов Word (.docx) через mammoth.
import { loadScript, LIB } from "../util/load.js";
import { renderHtmlToPdf } from "../util/pdf-render.js";

function wrapHtml(body, title) {
    return `<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8">` +
        `<meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>` +
        `<style>body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:780px;` +
        `margin:40px auto;padding:0 16px;line-height:1.6;color:#111}img{max-width:100%}` +
        `table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:4px 8px}</style>` +
        `</head><body>${body}</body></html>`;
}

// docx -> pdf (рендер через браузер, кириллица корректна)
export async function docxToPdf(file, onProgress) {
    onProgress?.(5);
    await loadScript(LIB.mammoth);
    const { value: html } = await window.mammoth.convertToHtml({
        arrayBuffer: await file.arrayBuffer(),
    });
    onProgress?.(35);
    const blob = await renderHtmlToPdf(html, onProgress);
    return { blob, ext: "pdf" };
}

// docx -> txt
export async function docxToText(file, onProgress) {
    onProgress?.(20);
    await loadScript(LIB.mammoth);
    const { value } = await window.mammoth.extractRawText({
        arrayBuffer: await file.arrayBuffer(),
    });
    onProgress?.(100);
    return { blob: new Blob([value], { type: "text/plain;charset=utf-8" }), ext: "txt" };
}

// docx -> html
export async function docxToHtml(file, onProgress) {
    onProgress?.(20);
    await loadScript(LIB.mammoth);
    const { value } = await window.mammoth.convertToHtml({
        arrayBuffer: await file.arrayBuffer(),
    });
    onProgress?.(100);
    const html = wrapHtml(value, file.name.replace(/\.[^.]+$/, ""));
    return { blob: new Blob([html], { type: "text/html;charset=utf-8" }), ext: "html" };
}
