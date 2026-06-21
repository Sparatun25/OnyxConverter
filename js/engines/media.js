// Движок аудио и видео на ffmpeg.wasm (всё считается в браузере).
// ВАЖНО (честно): транскодирование видео в браузере медленное и тяжёлое —
// для больших файлов это главный кандидат на переезд на сервер.
// Движок ffmpeg большой (~30 МБ) и грузится один раз при первой конвертации.
import { loadScript, LIB } from "../util/load.js";

const VIDEO_IN = ["mp4", "mov", "webm", "avi", "mkv"];

const MIME = {
    mp3: "audio/mpeg", wav: "audio/wav", ogg: "audio/ogg",
    m4a: "audio/mp4", flac: "audio/flac", aac: "audio/aac",
    mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime",
    avi: "video/x-msvideo", mkv: "video/x-matroska", gif: "image/gif",
};

let ff = null;
let progressCb = null;

const absUrl = (p) => (p.startsWith("http") ? p : location.origin + p);

async function getFFmpeg() {
    if (ff) return ff;
    await loadScript(LIB.ffmpeg);
    const { FFmpeg } = window.FFmpegWASM;
    const instance = new FFmpeg();
    instance.on("progress", ({ progress }) => {
        if (progressCb && progress >= 0 && progress <= 1) {
            progressCb(Math.min(99, Math.round(progress * 100)));
        }
    });
    // НЕ передаём classWorkerURL: тогда ffmpeg.js сам берёт классический воркер
    // /vendor/ffmpeg/814.ffmpeg.js (рядом с ffmpeg.js). С classWorkerURL он бы
    // создал module-воркер с зашитым file:///-путём, и importScripts ломается.
    await instance.load({
        coreURL: absUrl(LIB.ffmpegCore),
        wasmURL: absUrl(LIB.ffmpegWasm),
    });
    ff = instance; // кешируем только после успешной загрузки
    return ff;
}

// Полный сброс движка. Нужен после краша (wasm повреждается) или отмены —
// иначе следующая конвертация падала бы на «мёртвом» инстансе.
function killFFmpeg() {
    if (ff) { try { ff.terminate(); } catch (_) {} }
    ff = null;
    progressCb = null;
}

function buildArgs(input, output, from, to) {
    if (to === "mp3" && VIDEO_IN.includes(from)) return ["-i", input, "-vn", "-q:a", "2", output]; // извлечь звук
    if (to === "gif") return ["-i", input, "-vf", "fps=12,scale=480:-1:flags=lanczos", output];
    if (to === "mp3") return ["-i", input, "-q:a", "2", output];
    return ["-i", input, output];
}

export async function mediaConvert(file, from, to, onProgress, signal) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    onProgress?.(1);
    const ffmpeg = await getFFmpeg();
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError"); // отменили во время загрузки движка
    progressCb = onProgress;

    const input = "input." + from;
    const output = "output." + to;

    let onAbort;
    const abortP = new Promise((_, reject) => {
        if (signal?.aborted) return reject(new DOMException("Aborted", "AbortError"));
        onAbort = () => reject(new DOMException("Aborted", "AbortError"));
        if (signal) signal.addEventListener("abort", onAbort, { once: true });
    });

    const work = (async () => {
        await ffmpeg.writeFile(input, new Uint8Array(await file.arrayBuffer()));
        await ffmpeg.exec(buildArgs(input, output, from, to));
        const data = await ffmpeg.readFile(output);
        return new Blob([data.buffer], { type: MIME[to] || "application/octet-stream" });
    })();
    work.catch(() => {}); // гасим гонку с отменой, чтобы не было unhandledrejection

    try {
        const blob = await Promise.race([work, abortP]);
        onProgress?.(100);
        try { await ffmpeg.deleteFile(input); await ffmpeg.deleteFile(output); } catch (_) {}
        return { blob, ext: to };
    } catch (err) {
        // отмена или краш — движок в неопределённом состоянии, пересоздаём с нуля
        killFFmpeg();
        if (err?.name === "AbortError") throw err;
        throw new Error("media_failed");
    } finally {
        if (signal && onAbort) signal.removeEventListener("abort", onAbort);
    }
}
