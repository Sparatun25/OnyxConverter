# OnyxConverter: Universal File Converter & In-Browser AI Tools

## 🏗️ Project Overview & Roadmap
OnyxConverter is currently a client-side file converter processing files entirely in the browser using HTML5, Vanilla JS, WebAssembly (FFmpeg.wasm), and static multi-language generation.
- **Current Phase**: Client-side First (MVP) static site generated via `build.js`.
- **Future Phase**: Hybrid SaaS. Core utilities must remain decoupled from the UI to seamlessly switch/fallback from local processing to a future Backend API.
- **Business Model**: Freemium. Code must be prepared to support User Auth, Profile Management, and a Pro Subscription tier with strict usage limits.

## 💎 Impeccable Design & Premium Taste Rules
- **Aesthetic**: Premium, clean, minimalist dark/light UI inspired by Apple, Linear, and Vercel.
- **Micro-interactions**: Snappy, satisfying, and high-fidelity. Focus rings and button states must look customized and elegant.
- **Visual Feedback**: Mandatory states for all elements in `js/converter.js` and `js/compress.js`: idle, hover, drag-over, active/loading, success, error. Prevent layout shifts during state transitions.

## ✨ Emil Kowalski Interaction & Animation Principles
- **Motion Engine**: Since this is a Vanilla JS project, use smooth CSS Custom Properties, CSS Transitions, or lightweight physics-based animation scripts (avoid heavy libraries if possible, or use lightweight wrappers) to mimic high-stiffness, low-damping spring mechanics.
- **State Changes**: Smoothly animate all layout transitions (e.g., file drop area expanding into a file list, opening format selectors). 
- **Choreography**: Elements inside lists or grids (like tool cards) should fade/slide in with subtle delays upon loading.

## 🛠️ Tech Stack & Current Architecture

### Key Commands
- `npm run dev` - Build the site and start a local development server on port 5500
- `npm run build` / `node build.js` - Generate complete static website for Netlify/Cloudflare

### Core Components
1. **Build System (`build.js`)**: Pre-renders static HTML pages for all supported conversions and 6 languages (`ru` is root, `en/`, `es/`, `pt/`, `de/`, `fr/`).
2. **Conversion UI & Core (`js/converter.js`, `js/convert.js`)**: Drag-and-drop interface, unified registry pattern API mapping input/output pairs, and abort signals.
3. **Engines (`js/engines/`)**: Modular file processing handlers (`image.js`, `pdf.js`, `docx.js`, `text.js`, `media.js` with FFmpeg.wasm).

### Engineering & Performance Guidelines
- **UI & Logic Separation**: STRICTLY keep conversion logic in `js/engines/` separated from UI logic in `js/converter.js`.
- **Multi-threading**: Offload long-running tasks, heavy conversions, and future AI inferences (`transformers.js`) to dedicated **Web Workers** to maintain a smooth 60 FPS UI.
- **Memory Management**: For large files, use Origin Private File System (OPFS) or browser chunking. Avoid storing giant Blobs directly in RAM.
- **Security Headers**: Ensure COOP and COEP headers are documented or configured in `netlify.toml` / Cloudflare settings to allow `SharedArrayBuffer` for FFmpeg.wasm.

## 🔐 Auth, AI & Monetization Infrastructure (Future Proofing)
- **AI Tools Section**: Prepare to implement browser-based AI features ("Smart Vector", "Background Removal", "Smart Transcriber") using quantized models via `transformers.js` inside Web Workers.
- **User States**: Architecture must handle 3 states: `Guest` (unauthenticated), `Free User` (limited access), and `Pro User` (unlimited access).
- **Paywalls & Guards**: Create clean wrapper functions in `js/convert.js` to intercept premium tools or limit daily actions for free tiers, triggering an elegant upgrade modal.

## 🌐 International SEO & Localization (i18n) Rules
- **Multilingual Structure**: Supported locales: `ru` (default root), `en`, `es`, `pt`, `de`, `fr`. All static strings and metadata must be mapped via `data/i18n.js`. Never hardcode text strings in JS scripts.
- **Hreflang Tags**: `build.js` must programmatically output correct `<link rel="alternate" hreflang="..." href="..." />` tags for all 6 locales on every page, including `hreflang="x-default"`.
- **Dynamic Content**: Meta Titles, Descriptions, and H1 tags must dynamically match the conversion pair and locale generated via `pageData()` in `data/conversions.js`.

## 📡 Future Backend & Cloud Scalability Rules
- **Asynchronous API**: Design future server-side conversion tasks to utilize background queues (Redis + BullMQ/Celery).
- **Real-Time Progress**: Use Server-Sent Events (SSE) or WebSockets to stream processing percentages back to the client UI when backend is plugged in.
- **Direct-to-S3 Uploads**: Implement secure Presigned URLs so clients upload files directly to Cloud Object Storage, saving server bandwidth.

## 🛡️ Security & Attack Prevention Rules
- **XSS & File Sanitization**: Absolutely sanitize any file content rendered back to the user (especially SVG, HTML, and Markdown conversions). Use strictly safe DOM parsing or lightweight sanitization utilities to prevent Cross-Site Scripting (XSS).
- **Client-Side DOS Prevention**: Implement guards against "Zip Bombs" or decompression bombs before extracting or processing compressed files (`js/engines/`). Check uncompressed sizes from metadata before expanding files in memory.
- **Content Security Policy (CSP)**: Configure strict CSP headers via `netlify.toml` / Cloudflare configurations. Restrict script execution to trusted domains, enforce `upgrade-insecure-requests`, and tightly control connect-src definitions (only allow known AI models/analytics endpoints).
- **Secure Token & Session Management**: When implementing the future Auth layer, never store sensitive JWTs or session data in plain `localStorage` (vulnerable to XSS). Design the system to use secure, `HttpOnly`, `SameSite=Strict`, and `Secure` cookies.
- **File Upload Restrictions**: Enforce strict client-side MIME-type and magic-number (file signature) validation in `js/converter.js`. Do not rely solely on file extensions (`.jpg`, `.mp4`) to determine the file type, preventing malicious executable uploads.
- **Data Privacy & Compliance**: Since processing is currently local, explicitly state and verify that zero user file data leaks to external analytics. When switching to server-side, ensure strict temporary data cleanup (shredding/deleting processed files instantly from disk/S3 after delivery).

## 🔍 Deep Audit & Bug Prevention Rules
- **Memory Leak Prevention**: Strictly audit JS code for memory leaks when handling `Blob`, `ArrayBuffer`, and `URL.createObjectURL()`. Ensure every temporary Object URL is explicitly revoked using `URL.revokeObjectURL()` after the download or conversion is complete.
- **FFmpeg & WASM Lifecycle**: Always verify that the FFmpeg WASM instance is properly terminated, wiped, or reset if a conversion fails or is aborted by the user. Prevent orphaned WASM threads from draining user CPU.
- **Race Conditions**: Audit all asynchronous operations in `js/convert.js` and `js/engines/`. If a user cancels a conversion or uploads a new file mid-process, the previous asynchronous chains must be immediately terminated via `AbortSignal` to prevent overlapping state updates.
- **Error Boundaries**: Every file engine (`js/engines/`) must have strict `try/catch` blocks that catch low-level WebAssembly errors. Never allow a corrupted user file to crash the global `main.js` execution environment.
- **Strict Type Checking**: Even though this is Vanilla JS, simulate strict type and bounds checking. Ensure all file offset calculations, byte length checks, and slice operations are verified against maximum thresholds to prevent buffer overflow styles of crash.

