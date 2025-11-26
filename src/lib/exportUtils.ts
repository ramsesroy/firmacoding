import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Obtiene el tamaño real del contenido de la firma
 */
function getContentBounds(element: HTMLElement): { width: number; height: number; x: number; y: number } {
  // Buscar el elemento table que contiene la firma real
  const tableElement = element.querySelector('table');
  if (tableElement) {
    const rect = tableElement.getBoundingClientRect();
    const parentRect = element.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      x: rect.left - parentRect.left,
      y: rect.top - parentRect.top,
    };
  }
  
  // Si no hay tabla, usar el elemento completo
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    x: 0,
    y: 0,
  };
}

/**
 * Exporta una firma como imagen PNG
 */
export async function exportAsPNG(element: HTMLElement, filename: string = "firma"): Promise<void> {
  try {
    // Obtener el tamaño real del contenido
    const bounds = getContentBounds(element);
    
    // Capturar el elemento con el tamaño exacto del contenido
    const canvas = await html2canvas(element, {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      scale: 2, // Mayor calidad
      logging: false,
      backgroundColor: null, // Fondo transparente
      useCORS: true,
      allowTaint: false,
      windowWidth: bounds.width,
      windowHeight: bounds.height,
    } as any);

    // Convertir canvas a blob
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error("Error al generar la imagen");
      }

      // Crear URL temporal
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, "image/png");
  } catch (error) {
    console.error("Error al exportar como PNG:", error);
    // Fallback: intentar con el elemento original sin recortar
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        backgroundColor: null,
        useCORS: true,
      } as any);
      
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error("Error al generar la imagen");
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filename}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch (fallbackError) {
      throw error;
    }
  }
}

/**
 * Exporta una firma como PDF
 */
export async function exportAsPDF(element: HTMLElement, filename: string = "firma"): Promise<void> {
  try {
    // Obtener el tamaño real del contenido
    const bounds = getContentBounds(element);
    
    // Capturar el elemento con el tamaño exacto del contenido
    const canvas = await html2canvas(element, {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      scale: 2,
      logging: false,
      backgroundColor: null,
      useCORS: true,
      allowTaint: false,
      windowWidth: bounds.width,
      windowHeight: bounds.height,
    } as any);

    const imgData = canvas.toDataURL("image/png");
    
    // Calcular dimensiones en mm (1px = 0.264583mm a 96 DPI)
    const pxToMm = 0.264583;
    const imgWidthMm = canvas.width * pxToMm;
    const imgHeightMm = canvas.height * pxToMm;
    
    // Crear PDF con el tamaño exacto de la imagen (con un pequeño margen)
    const margin = 5; // 5mm de margen
    const pdfWidth = imgWidthMm + (margin * 2);
    const pdfHeight = imgHeightMm + (margin * 2);
    
    const pdf = new jsPDF({
      orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
      unit: "mm",
      format: [pdfWidth, pdfHeight],
    });

    // Agregar la imagen centrada con margen
    pdf.addImage(imgData, "PNG", margin, margin, imgWidthMm, imgHeightMm);

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Error al exportar como PDF:", error);
    // Fallback: intentar con el elemento original
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        backgroundColor: null,
        useCORS: true,
      } as any);
      
      const imgData = canvas.toDataURL("image/png");
      const pxToMm = 0.264583;
      const imgWidthMm = canvas.width * pxToMm;
      const imgHeightMm = canvas.height * pxToMm;
      const margin = 5;
      const pdfWidth = imgWidthMm + (margin * 2);
      const pdfHeight = imgHeightMm + (margin * 2);
      
      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });
      
      pdf.addImage(imgData, "PNG", margin, margin, imgWidthMm, imgHeightMm);
      pdf.save(`${filename}.pdf`);
    } catch (fallbackError) {
      throw error;
    }
  }
}

