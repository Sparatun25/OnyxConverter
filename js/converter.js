// Виджет-конвертер. Сам рисует свой интерфейс внутри переданного элемента.
//  - Главная: переключатель категории (фото/документы/аудио/видео) →
//    выбор «из → в» → загрузка файла.
//  - SEO-лендинг (<div class="converter" data-from="png" data-to="jpg">):
//    конвертация зафиксирована, нужно только загрузить файл.
import { convert, targetsFor, sourceFormats, normExt } from "./convert.js";
import { FORMATS, CATEGORIES } from "../data/conversions.js";

const up = (s) => (s || "").toUpperCase();
const I = (window.ONYX && window.ONYX.t) || {};
const tr = (k, def) => (I[k] != null ? I[k] : def);
const catLabel = (id) => (I.cat && I.cat[id]) || id;

function template() {
    return `
    <div class="switcher conv-categories"></div>
    <div class="conv-selectors"></div>
    <div class="dropzone" tabindex="0" role="button">
        <input type="file" class="file-input" hidden />
        <div class="dz-icon">↑</div>
        <div class="dz-text">${tr("drop", "перетащите файл сюда")}</div>
        <div class="dz-sub">${tr("dropSub", "или нажмите, чтобы выбрать")}</div>
    </div>
    <div class="conv-controls hidden">
        <div class="file-row">
            <span class="file-name"></span>
            <button class="ghost-btn small clear-btn" title="${tr("clear", "убрать файл")}">✕</button>
        </div>
        <button class="primary-btn process-btn">${tr("process", "обработать")}</button>
    </div>
    <div class="conv-result hidden">
        <div class="result-status"></div>
        <a class="primary-btn download-link" download>${tr("download", "скачать файл")}</a>
        <button class="ghost-btn small again-btn">${tr("again", "конвертировать ещё")}</button>
    </div>
    <div class="status-line"></div>`;
}

export function initConverter(root) {
    root.classList.add("converter");
    root.innerHTML = template();

    const q = (sel) => root.querySelector(sel);
    const catBar = q(".conv-categories");
    const selectors = q(".conv-selectors");
    const dropzone = q(".dropzone");
    const fileInput = q(".file-input");
    const dzText = q(".dz-text");
    const controls = q(".conv-controls");
    const resultBox = q(".conv-result");
    const fileNameEl = q(".file-name");
    const processBtn = q(".process-btn");
    const statusLine = q(".status-line");
    const downloadLink = q(".download-link");
    const resultStatus = q(".result-status");

    const fixed = !!(root.dataset.from && root.dataset.to);

    // категории, в которых есть хотя бы один исходный формат
    const sources = sourceFormats();
    const cats = CATEGORIES.filter((c) => sources.some((f) => FORMATS[f]?.kind === c.id));

    let category = fixed ? FORMATS[root.dataset.from]?.kind : cats[0]?.id;
    let from = root.dataset.from || sourcesInCategory(category)[0];
    let to = root.dataset.to || targetsFor(from)[0];
    let currentFile = null;
    let lastUrl = null;

    function sourcesInCategory(cat) {
        return sources.filter((f) => FORMATS[f]?.kind === cat);
    }

    // ── категории ──
    function renderCategories() {
        if (fixed) { catBar.classList.add("hidden"); return; }
        catBar.innerHTML = cats
            .map((c) => `<button class="switch-btn${c.id === category ? " active" : ""}" data-cat="${c.id}">${catLabel(c.id)}</button>`)
            .join("");
        catBar.querySelectorAll(".switch-btn").forEach((btn) =>
            btn.addEventListener("click", () => {
                category = btn.dataset.cat;
                from = sourcesInCategory(category)[0];
                to = targetsFor(from)[0];
                renderCategories();
                renderSelectors();
            })
        );
    }

    // ── селекторы форматов ──
    function renderSelectors() {
        if (fixed) {
            selectors.innerHTML =
                `<div class="format-chip">${up(from)}</div>` +
                `<span class="arrow">→</span>` +
                `<div class="format-chip">${up(to)}</div>`;
            dzText.textContent = tr("dropFixed", "перетащите {F} сюда").replace("{F}", up(from));
            return;
        }
        const fromOpts = sourcesInCategory(category)
            .map((f) => `<option value="${f}" ${f === from ? "selected" : ""}>${up(f)}</option>`)
            .join("");
        const toOpts = targetsFor(from)
            .map((t) => `<option value="${t}" ${t === to ? "selected" : ""}>${up(t)}</option>`)
            .join("");
        selectors.innerHTML =
            `<select class="cobalt-select from-select" aria-label="из формата">${fromOpts}</select>` +
            `<span class="arrow">→</span>` +
            `<select class="cobalt-select to-select" aria-label="в формат">${toOpts}</select>`;

        selectors.querySelector(".from-select").addEventListener("change", (e) => {
            from = e.target.value;
            to = targetsFor(from)[0];
            renderSelectors();
        });
        selectors.querySelector(".to-select").addEventListener("change", (e) => {
            to = e.target.value;
        });
    }

    // ── загрузка файла ──
    function extOf(name) {
        const m = /\.([a-z0-9]+)$/i.exec(name || "");
        return m ? m[1].toLowerCase() : "";
    }

    function loadFile(file) {
        currentFile = file;
        // В режиме главной подстраиваем категорию и «из» под реальный файл
        if (!fixed) {
            const ext = normExt(extOf(file.name));
            if (targetsFor(ext).length) {
                category = FORMATS[ext]?.kind || category;
                from = ext;
                if (!targetsFor(from).includes(to)) to = targetsFor(from)[0];
                renderCategories();
                renderSelectors();
            }
        }
        fileNameEl.textContent = file.name;
        dropzone.classList.add("hidden");
        resultBox.classList.add("hidden");
        controls.classList.remove("hidden");
        clearStatus();
    }

    dropzone.addEventListener("click", () => fileInput.click());
    dropzone.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); }
    });
    fileInput.addEventListener("change", (e) => {
        if (e.target.files[0]) loadFile(e.target.files[0]);
    });
    ["dragover", "dragenter"].forEach((ev) =>
        dropzone.addEventListener(ev, (e) => { e.preventDefault(); dropzone.classList.add("dragover"); })
    );
    ["dragleave", "drop"].forEach((ev) =>
        dropzone.addEventListener(ev, (e) => { e.preventDefault(); dropzone.classList.remove("dragover"); })
    );
    dropzone.addEventListener("drop", (e) => {
        const f = e.dataTransfer.files[0];
        if (f) loadFile(f);
    });

    // ── обработка ──
    processBtn.addEventListener("click", async () => {
        if (!currentFile) return;
        processBtn.disabled = true;
        const heavy = FORMATS[from]?.kind === "видео" || FORMATS[from]?.kind === "аудио";
        const proc = tr("processing", "обработка");
        setStatus(`<span class="spinner"></span>${heavy ? tr("loadingEngine", "загрузка движка… это может занять время") : proc + "… 0%"}`);
        try {
            const { blob, ext } = await convert(currentFile, from, to, (pct) => {
                setStatus(`<span class="spinner"></span>${proc}… ${pct}%`);
            });
            if (lastUrl) URL.revokeObjectURL(lastUrl);
            lastUrl = URL.createObjectURL(blob);
            const base = currentFile.name.replace(/\.[^.]+$/, "");
            downloadLink.href = lastUrl;
            downloadLink.download = `${base}.${ext}`;
            resultStatus.textContent = `готово · ${up(ext)} · ${formatSize(blob.size)}`;
            controls.classList.add("hidden");
            resultBox.classList.remove("hidden");
            clearStatus();
        } catch (err) {
            console.error(err);
            showError(err.message || tr("error", "ошибка конвертации"));
        } finally {
            processBtn.disabled = false;
        }
    });

    // ── сброс ──
    function reset() {
        currentFile = null;
        fileInput.value = "";
        controls.classList.add("hidden");
        resultBox.classList.add("hidden");
        dropzone.classList.remove("hidden");
        clearStatus();
    }
    q(".again-btn").addEventListener("click", reset);
    q(".clear-btn").addEventListener("click", reset);

    // ── статус ──
    function setStatus(html) { statusLine.classList.remove("error"); statusLine.innerHTML = html; }
    function clearStatus() { statusLine.textContent = ""; statusLine.classList.remove("error"); }
    function showError(msg) { statusLine.classList.add("error"); statusLine.textContent = msg; }
    function formatSize(b) {
        if (b < 1024) return b + " Б";
        if (b < 1024 * 1024) return (b / 1024).toFixed(0) + " КБ";
        return (b / 1024 / 1024).toFixed(1) + " МБ";
    }

    renderCategories();
    renderSelectors();
}

// автоинициализация всех виджетов на странице
document.querySelectorAll(".converter").forEach(initConverter);
