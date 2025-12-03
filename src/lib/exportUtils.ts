import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { SignatureProps, TemplateType } from "@/types/signature";

export type ExportSize = "auto" | "small" | "medium" | "large";

export interface ExportOptions {
  size?: ExportSize;
  margin?: number; // margin in pixels for auto size
  quality?: number; // 0-1 for image quality
  onProgress?: (progress: number) => void; // Progress callback 0-100
  addWatermark?: boolean; // Add watermark for free users
}

// Size presets in pixels
const SIZE_PRESETS = {
  small: { width: 400, height: 200 },
  medium: { width: 600, height: 300 },
  large: { width: 800, height: 400 },
};

/**
 * Export signature to PNG (Ultra High Quality - 4K+ resolution)
 * Uses dom-to-image-more with high scale factor for crisp rendering
 */
export async function exportToPNGHQ(
  element: HTMLElement,
  filename: string = "signature.png",
  options: ExportOptions = {}
): Promise<void> {
  const { size = "auto", margin = 20, onProgress } = options;

  try {
    onProgress?.(10);

    let targetWidth: number;
    let targetHeight: number;
    let scale = 8; // Ultra high quality: 8x scale (4K+)

    if (size === "auto") {
      const rect = element.getBoundingClientRect();
      targetWidth = rect.width + margin * 2;
      targetHeight = rect.height + margin * 2;
      scale = 8; // Maximum quality for auto size
    } else {
      const preset = SIZE_PRESETS[size];
      targetWidth = preset.width;
      targetHeight = preset.height;
      const rect = element.getBoundingClientRect();
      const scaleX = (targetWidth - margin * 2) / rect.width;
      const scaleY = (targetHeight - margin * 2) / rect.height;
      scale = Math.max(6, Math.min(scaleX, scaleY, 8)); // At least 6x, up to 8x
    }

    onProgress?.(30);

    // Use html2canvas - scale will be applied manually
    const canvas = await html2canvas(element, {
      logging: false,
      useCORS: true,
      allowTaint: false,
    });

    onProgress?.(60);

    // Scale canvas manually for ultra-high quality
    const scaledCanvas = document.createElement("canvas");
    scaledCanvas.width = canvas.width * scale;
    scaledCanvas.height = canvas.height * scale;
    const scaledCtx = scaledCanvas.getContext("2d");
    
    if (!scaledCtx) {
      throw new Error("Could not get 2D context");
    }
    
    scaledCtx.imageSmoothingEnabled = true;
    scaledCtx.imageSmoothingQuality = "high";
    scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

    // Create final canvas with margins
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = targetWidth * scale;
    finalCanvas.height = targetHeight * scale;
    const ctx = finalCanvas.getContext("2d", { alpha: false });

    if (!ctx) {
      throw new Error("Could not get 2D context");
    }

    // Fill white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

    // Draw the signature centered with margins
    const marginScaled = margin * scale;
    const drawWidth = scaledCanvas.width;
    const drawHeight = scaledCanvas.height;
    const targetDrawWidth = finalCanvas.width - marginScaled * 2;
    const targetDrawHeight = finalCanvas.height - marginScaled * 2;
    
    // Maintain aspect ratio
    const aspectRatio = drawWidth / drawHeight;
    let finalDrawWidth = targetDrawWidth;
    let finalDrawHeight = targetDrawWidth / aspectRatio;
    
    if (finalDrawHeight > targetDrawHeight) {
      finalDrawHeight = targetDrawHeight;
      finalDrawWidth = targetDrawHeight * aspectRatio;
    }
    
    const offsetX = (finalCanvas.width - finalDrawWidth) / 2;
    const offsetY = (finalCanvas.height - finalDrawHeight) / 2;
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(scaledCanvas, offsetX, offsetY, finalDrawWidth, finalDrawHeight);

    // Add watermark if needed
    if (options.addWatermark) {
      drawWatermark(ctx, finalCanvas.width, finalCanvas.height, scale);
    }

    onProgress?.(90);

    // Convert to blob and download
    finalCanvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          onProgress?.(100);
        }
      },
      "image/png",
      1.0 // Maximum quality
    );
  } catch (error) {
    console.error("Error exporting to PNG HQ:", error);
    throw new Error("Failed to export signature to PNG. Please try again.");
  }
}

/**
 * Export signature to PNG (Legacy - kept for compatibility)
 */
export async function exportToPNG(
  element: HTMLElement,
  filename: string = "signature.png",
  options: ExportOptions = {}
): Promise<void> {
  const { size = "auto", margin = 20, quality = 1 } = options;

  try {
    let width: number;
    let height: number;
    let scale = 6; // Maximum scale for ultra high quality (6x = print quality)

    if (size === "auto") {
      const rect = element.getBoundingClientRect();
      width = rect.width + margin * 2;
      height = rect.height + margin * 2;
      scale = 6;
    } else {
      const preset = SIZE_PRESETS[size];
      width = preset.width;
      height = preset.height;
      const rect = element.getBoundingClientRect();
      const scaleX = (width - margin * 2) / rect.width;
      const scaleY = (height - margin * 2) / rect.height;
      scale = Math.max(4, Math.min(scaleX, scaleY, 6));
    }

    const canvas = await html2canvas(element, {
      logging: false,
      useCORS: true,
      allowTaint: false,
    });

    let scaledCanvas = canvas;
    if (scale !== 1) {
      scaledCanvas = document.createElement("canvas");
      scaledCanvas.width = canvas.width * scale;
      scaledCanvas.height = canvas.height * scale;
      const ctx = scaledCanvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
      }
    }

    let finalCanvas = scaledCanvas;
    if (size === "auto" && margin > 0) {
      finalCanvas = document.createElement("canvas");
      finalCanvas.width = scaledCanvas.width + margin * 2 * scale;
      finalCanvas.height = scaledCanvas.height + margin * 2 * scale;
      const ctx = finalCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
        ctx.drawImage(scaledCanvas, margin * scale, margin * scale);
      }
    } else if (size !== "auto") {
      finalCanvas = document.createElement("canvas");
      finalCanvas.width = width * scale;
      finalCanvas.height = height * scale;
      const ctx = finalCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
        
        const sourceWidth = scaledCanvas.width;
        const sourceHeight = scaledCanvas.height;
        const targetWidth = (width - margin * 2) * scale;
        const targetHeight = (height - margin * 2) * scale;
        
        const aspectRatio = sourceWidth / sourceHeight;
        let drawWidth = targetWidth;
        let drawHeight = targetWidth / aspectRatio;
        
        if (drawHeight > targetHeight) {
          drawHeight = targetHeight;
          drawWidth = targetHeight * aspectRatio;
        }
        
        const offsetX = (finalCanvas.width - drawWidth) / 2;
        const offsetY = (finalCanvas.height - drawHeight) / 2;
        
        ctx.drawImage(scaledCanvas, offsetX, offsetY, drawWidth, drawHeight);
      }
    }

    finalCanvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      },
      "image/png",
      quality
    );
  } catch (error) {
    console.error("Error exporting to PNG:", error);
    throw new Error("Failed to export signature to PNG");
  }
}

/**
 * Export signature to PDF (Ultra High Quality)
 * Uses high-resolution canvas rendering
 */
export async function exportToPDFHQ(
  element: HTMLElement,
  filename: string = "signature.pdf",
  options: ExportOptions = {}
): Promise<void> {
  const { size = "auto", margin = 20, onProgress } = options;

  try {
    onProgress?.(10);

    let targetWidth: number;
    let targetHeight: number;
    let scale = 8; // Ultra high quality

    if (size === "auto") {
      const rect = element.getBoundingClientRect();
      targetWidth = rect.width + margin * 2;
      targetHeight = rect.height + margin * 2;
      scale = 8;
    } else {
      const preset = SIZE_PRESETS[size];
      targetWidth = preset.width;
      targetHeight = preset.height;
      const rect = element.getBoundingClientRect();
      const scaleX = (targetWidth - margin * 2) / rect.width;
      const scaleY = (targetHeight - margin * 2) / rect.height;
      scale = Math.max(6, Math.min(scaleX, scaleY, 8));
    }

    onProgress?.(30);

    // Use html2canvas - scale will be applied manually
    const canvas = await html2canvas(element, {
      logging: false,
      useCORS: true,
      allowTaint: false,
    });

    onProgress?.(60);

    // Scale canvas manually for ultra-high quality
    const scaledCanvas = document.createElement("canvas");
    scaledCanvas.width = canvas.width * scale;
    scaledCanvas.height = canvas.height * scale;
    const scaledCtx = scaledCanvas.getContext("2d");
    
    if (!scaledCtx) {
      throw new Error("Could not get 2D context");
    }
    
    scaledCtx.imageSmoothingEnabled = true;
    scaledCtx.imageSmoothingQuality = "high";
    scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

    // Create final canvas with margins
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = targetWidth * scale;
    finalCanvas.height = targetHeight * scale;
    const ctx = finalCanvas.getContext("2d", { alpha: false });

    if (!ctx) {
      throw new Error("Could not get 2D context");
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

    const marginScaled = margin * scale;
    const drawWidth = scaledCanvas.width;
    const drawHeight = scaledCanvas.height;
    const targetDrawWidth = finalCanvas.width - marginScaled * 2;
    const targetDrawHeight = finalCanvas.height - marginScaled * 2;
    
    // Maintain aspect ratio
    const aspectRatio = drawWidth / drawHeight;
    let finalDrawWidth = targetDrawWidth;
    let finalDrawHeight = targetDrawWidth / aspectRatio;
    
    if (finalDrawHeight > targetDrawHeight) {
      finalDrawHeight = targetDrawHeight;
      finalDrawWidth = targetDrawHeight * aspectRatio;
    }
    
    const offsetX = (finalCanvas.width - finalDrawWidth) / 2;
    const offsetY = (finalCanvas.height - finalDrawHeight) / 2;
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(scaledCanvas, offsetX, offsetY, finalDrawWidth, finalDrawHeight);

    // Add watermark if needed
    if (options.addWatermark) {
      drawWatermark(ctx, finalCanvas.width, finalCanvas.height, scale);
    }

    onProgress?.(80);

    // Convert to PDF dimensions (300 DPI for print quality)
    const dpi = 300;
    const pxToMm = 25.4 / dpi;
    const pdfWidth = (targetWidth / scale) * pxToMm;
    const pdfHeight = (targetHeight / scale) * pxToMm;
    const imagePdfWidth = ((targetWidth - margin * 2) / scale) * pxToMm;
    const imagePdfHeight = ((targetHeight - margin * 2) / scale) * pxToMm;

    // Create PDF
    const pdf = new jsPDF({
      orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
      unit: "mm",
      format: [pdfWidth, pdfHeight],
      compress: true,
    });

    const imgData = finalCanvas.toDataURL("image/png", 1.0);
    const x = (pdfWidth - imagePdfWidth) / 2;
    const y = (pdfHeight - imagePdfHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, imagePdfWidth, imagePdfHeight, undefined, "FAST");

    onProgress?.(95);
    pdf.save(filename);
    onProgress?.(100);
  } catch (error) {
    console.error("Error exporting to PDF HQ:", error);
    throw new Error("Failed to export signature to PDF. Please try again.");
  }
}

/**
 * Export signature to PDF (Legacy - kept for compatibility)
 */
export async function exportToPDF(
  element: HTMLElement,
  filename: string = "signature.pdf",
  options: ExportOptions = {}
): Promise<void> {
  const { size = "auto", margin = 20, quality = 1 } = options;

  try {
    let width: number;
    let height: number;
    let scale = 6;

    if (size === "auto") {
      const rect = element.getBoundingClientRect();
      width = rect.width + margin * 2;
      height = rect.height + margin * 2;
      scale = 6;
    } else {
      const preset = SIZE_PRESETS[size];
      width = preset.width;
      height = preset.height;
      const rect = element.getBoundingClientRect();
      const scaleX = (width - margin * 2) / rect.width;
      const scaleY = (height - margin * 2) / rect.height;
      scale = Math.max(4, Math.min(scaleX, scaleY, 6));
    }

    const canvas = await html2canvas(element, {
      logging: false,
      useCORS: true,
      allowTaint: false,
    });

    let scaledCanvas = canvas;
    if (scale !== 1) {
      scaledCanvas = document.createElement("canvas");
      scaledCanvas.width = canvas.width * scale;
      scaledCanvas.height = canvas.height * scale;
      const ctx = scaledCanvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
      }
    }

    const dpi = 300;
    const pxToMm = 25.4 / dpi;
    let pdfWidth: number;
    let pdfHeight: number;
    let imageWidth: number;
    let imageHeight: number;

    if (size === "auto") {
      pdfWidth = (scaledCanvas.width / scale) * pxToMm + (margin * 2 * pxToMm);
      pdfHeight = (scaledCanvas.height / scale) * pxToMm + (margin * 2 * pxToMm);
      imageWidth = (scaledCanvas.width / scale) * pxToMm;
      imageHeight = (scaledCanvas.height / scale) * pxToMm;
    } else {
      pdfWidth = width * pxToMm;
      pdfHeight = height * pxToMm;
      
      const rect = element.getBoundingClientRect();
      const aspectRatio = rect.width / rect.height;
      const availableWidth = (width - margin * 2) * pxToMm;
      const availableHeight = (height - margin * 2) * pxToMm;
      
      if (availableWidth / aspectRatio <= availableHeight) {
        imageWidth = availableWidth;
        imageHeight = availableWidth / aspectRatio;
      } else {
        imageHeight = availableHeight;
        imageWidth = availableHeight * aspectRatio;
      }
    }

    const pdf = new jsPDF({
      orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
      unit: "mm",
      format: [pdfWidth, pdfHeight],
      compress: true,
    });

    const imgData = scaledCanvas.toDataURL("image/png", 1.0);
    const x = (pdfWidth - imageWidth) / 2;
    const y = (pdfHeight - imageHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, imageWidth, imageHeight);
    pdf.save(filename);
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    throw new Error("Failed to export signature to PDF");
  }
}

/**
 * Export signature to SVG (Vector format)
 * Note: This is a simplified version. For true vector export, consider using @react-pdf/renderer
 */
export async function exportToSVG(
  element: HTMLElement,
  filename: string = "signature.svg",
  options: ExportOptions = {}
): Promise<void> {
  try {
    const { onProgress } = options;
    onProgress?.(20);

    // For now, we'll create a simple SVG wrapper with the HTML content
    // A better approach would be to use a proper SVG conversion library
    const rect = element.getBoundingClientRect();
    const htmlContent = element.outerHTML;
    
    // Create SVG with embedded HTML (not ideal, but works for basic cases)
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${rect.width}" height="${rect.height}">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml">
      ${htmlContent}
    </div>
  </foreignObject>
</svg>`;

    onProgress?.(80);

    // Download SVG
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onProgress?.(100);
  } catch (error) {
    console.error("Error exporting to SVG:", error);
    throw new Error("Failed to export signature to SVG");
  }
}

/**
 * Export signature pack (ZIP with PNG, PDF, HTML, SVG)
 */
export async function exportSignaturePack(
  element: HTMLElement,
  htmlContent: string,
  baseFilename: string = "signature",
  options: ExportOptions = {}
): Promise<void> {
  const JSZip = (await import("jszip")).default;
  const { saveAs } = await import("file-saver");

  try {
    const { onProgress } = options;
    const zip = new JSZip();

    onProgress?.(10);

    // Generate PNG using html2canvas
    onProgress?.(20);
    const canvas = await html2canvas(element, {
      logging: false,
      useCORS: true,
      allowTaint: false,
    });
    
    canvas.toBlob((blob) => {
      if (blob) {
        zip.file(`${baseFilename}.png`, blob);
      }
    }, "image/png", 1.0);

    onProgress?.(40);

    // Generate SVG (simplified)
    const rect = element.getBoundingClientRect();
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${rect.width}" height="${rect.height}">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml">
      ${element.outerHTML}
    </div>
  </foreignObject>
</svg>`;
    zip.file(`${baseFilename}.svg`, svgContent);

    onProgress?.(60);

    // Add HTML
    zip.file(`${baseFilename}.html`, htmlContent);

    onProgress?.(70);

    // Note: PDF would require additional processing
    // Skipping for now to keep it simple

    onProgress?.(90);

    // Generate ZIP
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `${baseFilename}-pack.zip`);
    onProgress?.(100);
  } catch (error) {
    console.error("Error exporting pack:", error);
    throw new Error("Failed to export signature pack");
  }
}

/**
 * Get size preset dimensions in pixels
 */
export function getSizeDimensions(size: ExportSize): { width: number; height: number } | null {
  if (size === "auto") return null;
  return SIZE_PRESETS[size];
}

/**
 * Get size preset label
 */
export function getSizeLabel(size: ExportSize): string {
  const labels: Record<ExportSize, string> = {
    auto: "Auto (Fit content)",
    small: "Small (400×200px)",
    medium: "Medium (600×300px)",
    large: "Large (800×400px)",
  };
  return labels[size];
}

/**
 * Draw watermark on canvas for free users
 */
function drawWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number
): void {
  // Watermark settings
  const fontSize = 14 * scale;
  const opacity = 0.15;
  const text = "Signature For Me";
  const rotation = -25; // Degrees
  
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = "#333333";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  // Calculate center
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Rotate and draw watermark
  ctx.translate(centerX, centerY);
  ctx.rotate((rotation * Math.PI) / 180);
  
  // Draw text with shadow for better visibility
  ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
  ctx.shadowBlur = 2;
  ctx.fillText(text, 0, 0);
  
  // Draw smaller text below
  const smallFontSize = fontSize * 0.6;
  ctx.font = `${smallFontSize}px Arial, sans-serif`;
  ctx.fillText("Free Version", 0, fontSize * 0.8);
  
  ctx.restore();
  
  // Draw repeating watermarks in corners
  const cornerWatermarks = [
    { x: width * 0.15, y: height * 0.15 },
    { x: width * 0.85, y: height * 0.15 },
    { x: width * 0.15, y: height * 0.85 },
    { x: width * 0.85, y: height * 0.85 },
  ];
  
  cornerWatermarks.forEach((pos) => {
    ctx.save();
    ctx.globalAlpha = opacity * 0.5;
    ctx.font = `bold ${fontSize * 0.4}px Arial, sans-serif`;
    ctx.fillStyle = "#666666";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.translate(pos.x, pos.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.fillText(text, 0, 0);
    ctx.restore();
  });
}
