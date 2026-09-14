import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.3.289/pdf.min.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.3.289/pdf.worker.min.mjs';

const viewer = document.getElementById('pdf-viewer');
const pdfUrl = viewer.dataset.pdf;

async function renderPDF() {
  try {
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);

      const container = document.createElement('div');
      container.className = 'pdf-page';

      const canvas = document.createElement('canvas');
      container.appendChild(canvas);
      viewer.appendChild(container);

      const context = canvas.getContext('2d');

      const baseViewport = page.getViewport({ scale: 1 });

      const availableWidth = viewer.clientWidth - 20;
      const scale = availableWidth / baseViewport.width;

      const viewport = page.getViewport({ scale });

      const outputScale = window.devicePixelRatio || 1;

      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);

      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      const transform =
        outputScale !== 1
          ? [outputScale, 0, 0, outputScale, 0, 0]
          : null;

      await page.render({
        canvasContext: context,
        transform,
        viewport
      }).promise;
    }
  } catch (error) {
    console.error(error);
    viewer.innerHTML =
      '<p class="pdf-error">Impossible de charger le portfolio.</p>';
  }
}

renderPDF();
