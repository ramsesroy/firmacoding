import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { SignatureProps, TemplateType } from "@/types/signature";

export type ExportSize = "auto" | "small" | "medium" | "large";

export interface ExportOptions {
  size?: ExportSize;
  margin?: number; // margin in pixels for auto size
  quality?: number; // 0-1 for image quality
}

// Size presets in pixels
const SIZE_PRESETS = {
  small: { width: 400, height: 200 },
  medium: { width: 600, height: 300 },
  large: { width: 800, height: 400 },
};

/**
 * Export signature to PNG
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
    let scale = 2; // Higher scale for better quality (2x = retina)

    if (size === "auto") {
      // Auto-size: capture the element's natural size with margins
      const rect = element.getBoundingClientRect();
      width = rect.width + margin * 2;
      height = rect.height + margin * 2;
    } else {
      // Use preset sizes
      const preset = SIZE_PRESETS[size];
      width = preset.width;
      height = preset.height;
      // Calculate scale to fit the signature in the preset size
      const rect = element.getBoundingClientRect();
      const scaleX = (width - margin * 2) / rect.width;
      const scaleY = (height - margin * 2) / rect.height;
      scale = Math.min(scaleX, scaleY, 2); // Don't scale up more than 2x
    }

    // Configure html2canvas options (only valid options)
    const canvas = await html2canvas(element, {
      logging: false,
      useCORS: true,
      allowTaint: false,
    });

    // Scale the canvas manually for high quality
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

    // Create a new canvas with margins if needed
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
      // Resize to preset dimensions
      finalCanvas = document.createElement("canvas");
      finalCanvas.width = width * scale;
      finalCanvas.height = height * scale;
      const ctx = finalCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
        
        // Calculate dimensions to center the signature
        const sourceWidth = scaledCanvas.width;
        const sourceHeight = scaledCanvas.height;
        const targetWidth = (width - margin * 2) * scale;
        const targetHeight = (height - margin * 2) * scale;
        
        // Maintain aspect ratio
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
 * Export signature to PDF
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
    let scale = 2; // Higher scale for better quality

    if (size === "auto") {
      const rect = element.getBoundingClientRect();
      width = rect.width + margin * 2;
      height = rect.height + margin * 2;
    } else {
      const preset = SIZE_PRESETS[size];
      width = preset.width;
      height = preset.height;
      const rect = element.getBoundingClientRect();
      const scaleX = (width - margin * 2) / rect.width;
      const scaleY = (height - margin * 2) / rect.height;
      scale = Math.min(scaleX, scaleY, 2);
    }

    // Capture element to canvas (only valid options)
    const canvas = await html2canvas(element, {
      logging: false,
      useCORS: true,
      allowTaint: false,
    });

    // Scale the canvas manually for high quality
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

    // Convert pixels to mm (1 inch = 25.4mm, assuming 96 DPI)
    const pxToMm = 25.4 / 96;
    let pdfWidth: number;
    let pdfHeight: number;
    let imageWidth: number;
    let imageHeight: number;

    if (size === "auto") {
      // Auto-size: use canvas dimensions
      pdfWidth = (scaledCanvas.width / scale) * pxToMm + (margin * 2 * pxToMm);
      pdfHeight = (scaledCanvas.height / scale) * pxToMm + (margin * 2 * pxToMm);
      imageWidth = (scaledCanvas.width / scale) * pxToMm;
      imageHeight = (scaledCanvas.height / scale) * pxToMm;
    } else {
      // Use preset sizes
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

    // Create PDF
    const pdf = new jsPDF({
      orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
      unit: "mm",
      format: [pdfWidth, pdfHeight],
    });

    // Convert canvas to image data
    const imgData = scaledCanvas.toDataURL("image/png", quality);

    // Calculate position to center the image
    const x = (pdfWidth - imageWidth) / 2;
    const y = (pdfHeight - imageHeight) / 2;

    // Add image to PDF
    pdf.addImage(imgData, "PNG", x, y, imageWidth, imageHeight);

    // Save PDF
    pdf.save(filename);
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    throw new Error("Failed to export signature to PDF");
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


