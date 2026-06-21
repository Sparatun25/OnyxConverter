// Общий рендер HTML -> PDF через html2canvas + jsPDF.
// Используется для docx->pdf и txt->pdf. Браузер рисует HTML сам,
// поэтому кириллица отображается корректно. Минус: текст становится «картинкой».
// Идеальное качество (с выделяемым текстом) — задача серверной версии (LibreOffice).
import { loadScript, LIB } from "./load.js";

export async function renderHtmlToPdf(html, onProgress) {
    await loadScript(LIB.html2canvas);
    await loadScript(LIB.jspdf);

    const container = document.createElement("div");
    container.innerHTML = html;
    Object.assign(container.style, {
        position: "fixed",
        left: "-99999px",
        top: "0",
        width: "794px", // ширина листа A4 при 96dpi
        padding: "48px",
        background: "#ffffff",
        color: "#000000",
        fontFamily: "Arial, sans-serif",
        fontSize: "15px",
        lineHeight: "1.5",
        boxSizing: "border-box",
    });
    document.body.appendChild(container);

    try {
        onProgress?.(50);
        const canvas = await window.html2canvas(container, { scale: 2, backgroundColor: "#ffffff" });
        onProgress?.(80);

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("p", "pt", "a4");
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        const imgW = pageW;
        const imgH = (canvas.height * imgW) / canvas.width;
        const imgData = canvas.toDataURL("image/jpeg", 0.92);

        let heightLeft = imgH;
        let position = 0;
        pdf.addImage(imgData, "JPEG", 0, position, imgW, imgH);
        heightLeft -= pageH;
        while (heightLeft > 0) {
            position -= pageH;
            pdf.addPage();
            pdf.addImage(imgData, "JPEG", 0, position, imgW, imgH);
            heightLeft -= pageH;
        }
        onProgress?.(100);
        return pdf.output("blob");
    } finally {
        container.remove();
    }
}
