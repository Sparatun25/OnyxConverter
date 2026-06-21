// Движок текстовых форматов: Markdown и обычный текст.
import { loadScript, LIB } from "../util/load.js";
import { renderHtmlToPdf } from "../util/pdf-render.js";

const escapeHtml = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function wrapHtml(body, title) {
    return `<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8">` +
        `<meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>` +
        `<style>body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:780px;` +
        `margin:40px auto;padding:0 16px;line-height:1.6;color:#111}` +
        `pre{background:#f4f4f4;padding:12px;border-radius:8px;overflow:auto}` +
        `code{background:#f4f4f4;padding:2px 4px;border-radius:4px}img{max-width:100%}</style>` +
        `</head><body>${body}</body></html>`;
}

// markdown -> html
export async function mdToHtml(file, onProgress) {
    onProgress?.(20);
    await loadScript(LIB.marked);
    const md = await file.text();
    const body = window.marked.parse(md);
    onProgress?.(100);
    const html = wrapHtml(body, file.name.replace(/\.[^.]+$/, ""));
    return { blob: new Blob([html], { type: "text/html;charset=utf-8" }), ext: "html" };
}

// txt -> pdf
export async function txtToPdf(file, onProgress) {
    onProgress?.(10);
    const text = await file.text();
    const html =
        `<pre style="white-space:pre-wrap;word-wrap:break-word;font-family:Arial,sans-serif;` +
        `font-size:14px;line-height:1.55;margin:0;">${escapeHtml(text)}</pre>`;
    const blob = await renderHtmlToPdf(html, onProgress);
    return { blob, ext: "pdf" };
}
