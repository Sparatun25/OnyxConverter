// Виджет сжатия (client-side) с категориями.
//  фото — Canvas; документы — PDF (pdf.js → JPEG → pdf-lib); аудио/видео — в разработке.
import { loadScript, LIB } from "./util/load.js";

const MIME = { jpg: "image/jpeg", webp: "image/webp", png: "image/png" };
const I = (window.ONYX && window.ONYX.t) || {};
const tr = (k, def) => (I[k] != null ? I[k] : def);
const catLabel = (id) => (I.cat && I.cat[id]) || id;

const CATS = [
    { id: "фото", mode: "image" },
    { id: "документ", mode: "pdf" },
    { id: "аудио", mode: "dev" },
    { id: "видео", mode: "dev" },
];

const fmtSize = (b) =>
    b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(0) + " KB" : (b / 1048576).toFixed(1) + " MB";

const wrench = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2.1-.6-.6-2.1 2.1-2.1z"/></svg>`;

function template() {
    return `
    <div class="switcher comp-categories"></div>
    <div class="comp-stage"></div>
    <div class="comp-controls hidden"></div>
    <div class="comp-result hidden">
        <div class="comp-badge"><span class="comp-saved"></span><span class="comp-saved-label">${tr("cSavedLabel", "меньше")}</span></div>
        <div class="comp-sizes"><span class="sz-old"></span><span class="sz-arrow">→</span><span class="sz-new"></span></div>
        <a class="primary-btn download-link" download>${tr("download", "скачать файл")}</a>
        <button class="ghost-btn small again-btn">${tr("cAgain", "сжать другой файл")}</button>
    </div>
    <div class="status-line"></div>`;
}

function dropzoneHtml(accept, formats) {
    return `<div class="dropzone" tabindex="0" role="button">
        <input type="file" class="file-input" accept="${accept}" hidden />
        <div class="dz-icon">↓</div>
        <div class="dz-text">${tr("drop", "перетащите файл сюда")}</div>
        <div class="dz-sub">${formats} · ${tr("dropSub", "или нажмите")}</div>
    </div>`;
}

function indevHtml() {
    return `<div class="indev-card">
        <div class="indev-icon">${wrench}</div>
        <div class="indev-title">${tr("inDev", "в разработке")}</div>
        <div class="indev-sub">${tr("inDevSub", "скоро добавим")}</div>
    </div>`;
}

function imageControls(name, size) {
    return `
    <div class="file-row"><span class="file-name">${name} · ${fmtSize(size)}</span><button class="ghost-btn small clear-btn" title="${tr("clear", "убрать")}">✕</button></div>
    <label class="comp-row"><span>${tr("cFormat", "формат")}</span>
      <select class="cobalt-select fmt-select"><option value="jpg">JPG</option><option value="webp">WEBP</option><option value="png">PNG</option></select></label>
    <label class="comp-row qual-row"><span>${tr("cQuality", "качество")} <b class="qual-val">80%</b></span>
      <input type="range" class="qual-range" min="10" max="100" value="80" /></label>
    <label class="comp-row"><span>${tr("cMaxWidth", "макс. ширина, px")}</span>
      <input type="number" class="maxw-input cobalt-input" placeholder="${tr("cAsIs", "как есть")}" min="16" /></label>
    <button class="primary-btn comp-btn">${tr("cDo", "сжать")}</button>`;
}

function pdfControls(name, size) {
    return `
    <div class="file-row"><span class="file-name">${name} · ${fmtSize(size)}</span><button class="ghost-btn small clear-btn" title="${tr("clear", "убрать")}">✕</button></div>
    <label class="comp-row qual-row"><span>${tr("cQuality", "качество")} <b class="qual-val">75%</b></span>
      <input type="range" class="qual-range" min="10" max="100" value="75" /></label>
    <label class="comp-row"><span>${tr("cResolution", "разрешение")}</span>
      <select class="cobalt-select res-select"><option value="1">${tr("cResLow", "ниже")}</option><option value="1.5" selected>${tr("cResMed", "среднее")}</option><option value="2">${tr("cResHigh", "выше")}</option></select></label>
    <button class="primary-btn comp-btn">${tr("cDo", "сжать")}</button>`;
}

// ── PDF: рендер страниц и сборка нового PDF из JPEG ──
async function compressPdf(file, quality, scale, onProgress) {
    await loadScript(LIB.pdfjs);
    const pdfjs = window.pdfjsLib;
    pdfjs.GlobalWorkerOptions.workerSrc = LIB.pdfjsWorker;
    await loadScript(LIB.pdfLib);
    const { PDFDocument } = window.PDFLib;

    const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    const out = await PDFDocument.create();
    for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const vp = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width; canvas.height = vp.height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport: vp }).promise;
        const jpg = await new Promise((r) => canvas.toBlob(r, "image/jpeg", quality));
        const img = await out.embedJpg(await jpg.arrayBuffer());
        const p = out.addPage([vp.width, vp.height]);
        p.drawImage(img, { x: 0, y: 0, width: vp.width, height: vp.height });
        onProgress?.(Math.round((i / doc.numPages) * 100));
    }
    return new Blob([await out.save()], { type: "application/pdf" });
}

async function decodeImage(file) {
    if ("createImageBitmap" in window) {
        try { const b = await createImageBitmap(file); return { img: b, w: b.width, h: b.height }; } catch (_) {}
    }
    const url = URL.createObjectURL(file);
    const img = await new Promise((res, rej) => {
        const i = new Image();
        i.onload = () => res(i); i.onerror = () => rej(new Error("не удалось прочитать изображение"));
        i.src = url;
    });
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    return { img, w: img.naturalWidth || 1024, h: img.naturalHeight || 768 };
}

export function initCompressor(root) {
    root.classList.add("compressor", "converter");
    root.innerHTML = template();
    const q = (s) => root.querySelector(s);

    const catBar = q(".comp-categories");
    const stage = q(".comp-stage");
    const controls = q(".comp-controls");
    const resultBox = q(".comp-result");
    const statusLine = q(".status-line");
    const downloadLink = q(".download-link");

    let category = "фото";
    let currentFile = null;
    let lastUrl = null;

    const modeOf = (id) => CATS.find((c) => c.id === id).mode;

    function renderCategories() {
        catBar.innerHTML = CATS
            .map((c) => `<button class="switch-btn${c.id === category ? " active" : ""}" data-cat="${c.id}">${catLabel(c.id)}</button>`)
            .join("");
        catBar.querySelectorAll(".switch-btn").forEach((btn) =>
            btn.addEventListener("click", () => {
                category = btn.dataset.cat;
                catBar.querySelectorAll(".switch-btn").forEach((b) => b.classList.toggle("active", b.dataset.cat === category));
                reset();
            })
        );
    }

    function renderStage() {
        const mode = modeOf(category);
        controls.classList.add("hidden");
        resultBox.classList.add("hidden");
        statusLine.textContent = "";
        if (mode === "dev") { stage.innerHTML = indevHtml(); stage.classList.remove("hidden"); return; }
        stage.innerHTML = mode === "pdf"
            ? dropzoneHtml("application/pdf", "PDF")
            : dropzoneHtml("image/*", "JPG, PNG, WEBP");
        stage.classList.remove("hidden");
        wireDropzone();
    }

    function wireDropzone() {
        const dropzone = stage.querySelector(".dropzone");
        const fileInput = stage.querySelector(".file-input");
        dropzone.addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", (e) => e.target.files[0] && loadFile(e.target.files[0]));
        ["dragover", "dragenter"].forEach((ev) => dropzone.addEventListener(ev, (e) => { e.preventDefault(); dropzone.classList.add("dragover"); }));
        ["dragleave", "drop"].forEach((ev) => dropzone.addEventListener(ev, (e) => { e.preventDefault(); dropzone.classList.remove("dragover"); }));
        dropzone.addEventListener("drop", (e) => e.dataTransfer.files[0] && loadFile(e.dataTransfer.files[0]));
    }

    function loadFile(file) {
        currentFile = file;
        const mode = modeOf(category);
        controls.innerHTML = (mode === "pdf" ? pdfControls : imageControls)(file.name, file.size);
        stage.classList.add("hidden");
        resultBox.classList.add("hidden");
        controls.classList.remove("hidden");
        statusLine.textContent = "";

        const qual = controls.querySelector(".qual-range");
        const qualVal = controls.querySelector(".qual-val");
        qual.addEventListener("input", () => (qualVal.textContent = qual.value + "%"));
        const fmt = controls.querySelector(".fmt-select");
        if (fmt) fmt.addEventListener("change", () => {
            controls.querySelector(".qual-row").style.display = fmt.value === "png" ? "none" : "";
        });
        controls.querySelector(".clear-btn").addEventListener("click", reset);
        controls.querySelector(".comp-btn").addEventListener("click", run);
    }

    async function run() {
        if (!currentFile) return;
        const btn = controls.querySelector(".comp-btn");
        btn.disabled = true;
        statusLine.classList.remove("error");
        statusLine.innerHTML = `<span class="spinner"></span>${tr("cing", "сжатие")}…`;
        try {
            const quality = (controls.querySelector(".qual-range")?.value || 80) / 100;
            let blob, ext;
            if (modeOf(category) === "pdf") {
                const scale = parseFloat(controls.querySelector(".res-select").value);
                blob = await compressPdf(currentFile, quality, scale, (p) => {
                    statusLine.innerHTML = `<span class="spinner"></span>${tr("cing", "сжатие")}… ${p}%`;
                });
                ext = "pdf";
            } else {
                const to = controls.querySelector(".fmt-select").value;
                const d = await decodeImage(currentFile);
                let w = d.w, h = d.h;
                const maxW = parseInt(controls.querySelector(".maxw-input").value, 10);
                if (maxW && maxW < w) { h = Math.round((h * maxW) / w); w = maxW; }
                const canvas = document.createElement("canvas");
                canvas.width = w; canvas.height = h;
                const ctx = canvas.getContext("2d");
                if (to === "jpg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); }
                ctx.drawImage(d.img, 0, 0, w, h);
                blob = await new Promise((r) => canvas.toBlob(r, MIME[to], to === "png" ? undefined : quality));
                ext = to;
            }
            if (!blob) throw new Error(tr("error", "ошибка сжатия"));

            if (lastUrl) URL.revokeObjectURL(lastUrl);
            lastUrl = URL.createObjectURL(blob);
            const base = currentFile.name.replace(/\.[^.]+$/, "");
            downloadLink.href = lastUrl;
            downloadLink.download = `${base}-min.${ext}`;
            const saved = Math.max(0, Math.round((1 - blob.size / currentFile.size) * 100));
            resultBox.querySelector(".comp-saved").textContent = "−" + saved + "%";
            resultBox.querySelector(".sz-old").textContent = fmtSize(currentFile.size);
            resultBox.querySelector(".sz-new").textContent = fmtSize(blob.size);
            controls.classList.add("hidden");
            resultBox.classList.remove("hidden");
            statusLine.textContent = "";
        } catch (err) {
            console.error(err);
            statusLine.classList.add("error");
            statusLine.textContent = err.message || tr("error", "ошибка сжатия");
        } finally {
            btn.disabled = false;
        }
    }

    function reset() {
        currentFile = null;
        controls.innerHTML = "";
        renderStage();
    }

    q(".again-btn").addEventListener("click", reset);
    renderCategories();
    renderStage();
}

document.querySelectorAll(".compressor").forEach(initCompressor);
