import * as pdfjsLib from "https://cdn.jsdelivr.net/npm/pdfjs-dist@6.3.289/build/pdf.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@6.3.289/build/pdf.worker.mjs";

const viewer = document.getElementById("pdf-viewer");
const pdfUrl = viewer.dataset.pdf;

async function renderPDF() {
  try {
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);

      const container = document.createElement("div");
      container.className = "pdf-page";

      const canvas = document.createElement("canvas");
      container.appendChild(canvas);
      viewer.appendChild(container);

      const context = canvas.getContext("2d");

      const initialViewport = page.getViewport({ scale: 1 });

      const availableWidth = viewer.clientWidth - 20;
      const scale = availableWidth / initialViewport.width;

      const viewport = page.getViewport({ scale });

      const outputScale = window.devicePixelRatio || 1;

      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);

      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      await page.render({
        canvasContext: context,
        viewport: viewport,
        transform:
          outputScale !== 1
            ? [outputScale, 0, 0, outputScale, 0, 0]
            : null
      }).promise;
    }
  } catch (error) {
    console.error("PDF.js :", error);
    viewer.innerHTML =
      "<p class='pdf-error'>Impossible de charger le portfolio.</p>";
  }
}

renderPDF();
