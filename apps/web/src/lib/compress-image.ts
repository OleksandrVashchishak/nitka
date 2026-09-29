/** Max stored / uploaded image size for wedding site photos. */
export const MAX_IMAGE_BYTES = 500 * 1024;

const MAX_EDGE = 1920;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Не вдалось прочитати зображення"));
    };
    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Не вдалось стиснути зображення"));
          return;
        }
        resolve(blob);
      },
      type,
      quality,
    );
  });
}

function drawScaled(
  img: HTMLImageElement,
  maxEdge: number,
): HTMLCanvasElement {
  const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas недоступний");
  ctx.drawImage(img, 0, 0, w, h);
  return canvas;
}

/**
 * Shrinks an image to ≤ maxBytes (default 500 KB) via resize + JPEG quality.
 * Small enough files are returned as-is.
 */
export async function compressImageFile(
  file: File,
  maxBytes = MAX_IMAGE_BYTES,
): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Дозволені лише зображення");
  }

  if (file.size <= maxBytes) return file;

  const img = await loadImage(file);
  let maxEdge = MAX_EDGE;
  let quality = 0.82;
  let best: Blob | null = null;

  for (let attempt = 0; attempt < 12; attempt++) {
    const canvas = drawScaled(img, maxEdge);
    const blob = await canvasToBlob(canvas, "image/jpeg", quality);
    best = blob;
    if (blob.size <= maxBytes) break;

    if (quality > 0.45) {
      quality = Math.max(0.45, quality - 0.12);
    } else {
      maxEdge = Math.round(maxEdge * 0.75);
      quality = 0.72;
    }
  }

  if (!best || best.size > maxBytes) {
    throw new Error("Не вдалось стиснути фото до 500 КБ");
  }

  const base = file.name.replace(/\.[^.]+$/, "") || "photo";
  return new File([best], `${base}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}
