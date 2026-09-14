const viewer = document.getElementById("pdf-viewer");

const pdfFile = window.location.pathname.includes("designgraphique")
  ? "portfolio_josephine_joffrin_2026_design_graphique.pdf"
  : "portfolio_josephine_joffrin_2026_illustration.pdf";

const pdfUrl = new URL(pdfFile, window.location.href).href;

async function renderPDF() {
  try {
    const pdfjsLib = await import(
      "https://cdn.jsdelivr.net/npm/pdfjs-dist@6.3.289/build/pdf.mjs"
    );

    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdn.jsdelivr.net/npm/pdfjs-dist@6.3.289/build/pdf.worker.mjs";

    const response = await fetch(pdfUrl);

    if (!response.ok) {
      throw new Error("PDF introuvable : " + response.status);
    }

    const data = new Uint8Array(await response.arrayBuffer());

    const pdf = await pdfjsLib.getDocument({
      data: data,
      useSystemFonts: true,
      isEvalSupported: true,
      disableFontFace: false
    }).promise;

    viewer.innerHTML = "";

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);

      const container = document.createElement("div");
      container.className = "pdf-page";

      const canvas = document.createElement("canvas");
      container.appendChild(canvas);
      viewer.appendChild(container);

      const context = canvas.getContext("2d", {
        alpha: false
      });

      const baseViewport = page.getViewport({ scale: 1 });
      const availableWidth = viewer.clientWidth - 20;
      const scale = availableWidth / baseViewport.width;
      const viewport = page.getViewport({ scale });

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(viewport.width * pixelRatio);
      canvas.height = Math.floor(viewport.height * pixelRatio);

      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      await page.render({
        canvasContext: context,
        viewport: viewport,
        transform: [pixelRatio, 0, 0, pixelRatio, 0, 0],
        intent: "display"
      }).promise;
    }

  } catch (error) {
    console.error("Erreur PDF.js :", error);
    viewer.innerHTML =
      "<p class='pdf-error'>Impossible de charger le portfolio.</p>";
  }
}

renderPDF();
