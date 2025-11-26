import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Encuentra el elemento de contenido real (la tabla de la firma)
 */
function findContentElement(element: HTMLElement): HTMLElement | null {
  // Buscar el elemento table que contiene la firma real
  const tableElement = element.querySelector('table');
  if (tableElement) {
    return tableElement as HTMLElement;
  }
  
  // Si no hay tabla, buscar el primer div con contenido
  const contentDiv = element.querySelector('div > *');
  if (contentDiv) {
    return contentDiv as HTMLElement;
  }
  
  // Si no hay nada, usar el elemento completo
  return element;
}

/**
 * Exporta una firma como imagen PNG
 * @param element - Elemento HTML que contiene la firma
 * @param filename - Nombre del archivo (sin extensión)
 * @param backgroundColor - Color de fondo ('white' | 'black' | 'transparent'). Default: 'white'
 */
export async function exportAsPNG(
  element: HTMLElement, 
  filename: string = "firma",
  backgroundColor: 'white' | 'black' | 'transparent' = 'white'
): Promise<void> {
  try {
    // Encontrar el elemento de contenido real (la tabla)
    const contentElement = findContentElement(element);
    
    if (!contentElement) {
      throw new Error("No se encontró el contenido de la firma");
    }

    // Calcular padding para evitar que se corten las letras (30px en cada lado, más en la parte inferior)
    const padding = 30;
    const paddingBottom = 40; // Más padding en la parte inferior
    const rect = contentElement.getBoundingClientRect();
    
    // Capturar el elemento de contenido con padding
    const canvas = await html2canvas(contentElement, {
      scale: 2, // Mayor calidad
      logging: false,
      backgroundColor: backgroundColor === 'transparent' ? null : backgroundColor,
      useCORS: true,
      allowTaint: false,
      scrollX: 0,
      scrollY: 0,
      // Agregar padding al canvas
      onclone: (clonedDoc: Document) => {
        const clonedElement = clonedDoc.querySelector('table') || clonedDoc.body;
        if (clonedElement) {
          const style = (clonedElement as HTMLElement).style;
          style.padding = `${padding}px ${padding}px ${paddingBottom}px ${padding}px`;
          style.boxSizing = 'border-box';
          style.display = 'block';
        }
      },
    } as any);

    // Crear un nuevo canvas con padding adicional (más espacio en la parte inferior)
    const paddingScaled = padding * 2; // Escala 2
    const paddingBottomScaled = paddingBottom * 2; // Escala 2
    const paddedCanvas = document.createElement('canvas');
    paddedCanvas.width = canvas.width + (paddingScaled * 2); // padding izquierdo y derecho
    paddedCanvas.height = canvas.height + paddingScaled + paddingBottomScaled; // padding superior e inferior (más abajo)
    const ctx = paddedCanvas.getContext('2d');
    
    if (!ctx) {
      throw new Error("Error al crear contexto del canvas");
    }

    // Rellenar el fondo
    if (backgroundColor === 'white') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
    } else if (backgroundColor === 'black') {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
    }
    // Si es transparente, no rellenamos

    // Dibujar el canvas original centrado con padding (más espacio abajo)
    ctx.drawImage(canvas, paddingScaled, paddingScaled);

    // Convertir canvas a blob
    paddedCanvas.toBlob((blob) => {
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
    // Fallback: intentar con el elemento original completo
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        backgroundColor: backgroundColor === 'transparent' ? null : backgroundColor,
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
      console.error("Error en fallback PNG:", fallbackError);
      throw error;
    }
  }
}

/**
 * Exporta una firma como PDF
 */
export async function exportAsPDF(element: HTMLElement, filename: string = "firma"): Promise<void> {
  try {
    // Encontrar el elemento de contenido real (la tabla)
    const contentElement = findContentElement(element);
    
    if (!contentElement) {
      throw new Error("No se encontró el contenido de la firma");
    }

    // Calcular padding para evitar que se corten las letras (30px en cada lado, más en la parte inferior)
    const padding = 30;
    const paddingBottom = 40; // Más padding en la parte inferior
    
    // Capturar el elemento de contenido con fondo blanco y padding
    const canvas = await html2canvas(contentElement, {
      scale: 2,
      logging: false,
      backgroundColor: '#ffffff', // Fondo blanco para PDF
      useCORS: true,
      allowTaint: false,
      scrollX: 0,
      scrollY: 0,
      // Agregar padding al canvas
      onclone: (clonedDoc: Document) => {
        const clonedElement = clonedDoc.querySelector('table') || clonedDoc.body;
        if (clonedElement) {
          const style = (clonedElement as HTMLElement).style;
          style.padding = `${padding}px ${padding}px ${paddingBottom}px ${padding}px`;
          style.boxSizing = 'border-box';
          style.display = 'block';
        }
      },
    } as any);

    // Crear un nuevo canvas con padding adicional (más espacio en la parte inferior)
    const paddingScaled = padding * 2; // Escala 2
    const paddingBottomScaled = paddingBottom * 2; // Escala 2
    const paddedCanvas = document.createElement('canvas');
    paddedCanvas.width = canvas.width + (paddingScaled * 2); // padding izquierdo y derecho
    paddedCanvas.height = canvas.height + paddingScaled + paddingBottomScaled; // padding superior e inferior (más abajo)
    const ctx = paddedCanvas.getContext('2d');
    
    if (!ctx) {
      throw new Error("Error al crear contexto del canvas");
    }

    // Rellenar el fondo blanco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);

    // Dibujar el canvas original centrado con padding (más espacio abajo)
    ctx.drawImage(canvas, paddingScaled, paddingScaled);

    const imgData = paddedCanvas.toDataURL("image/png");
    
    // Calcular dimensiones en mm (1px = 0.264583mm a 96 DPI)
    const pxToMm = 0.264583;
    const imgWidthMm = paddedCanvas.width * pxToMm;
    const imgHeightMm = paddedCanvas.height * pxToMm;
    
    // Crear PDF con el tamaño exacto de la imagen (con un pequeño margen adicional)
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
    // Fallback: intentar con el elemento original completo
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        backgroundColor: '#ffffff',
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
      console.error("Error en fallback PDF:", fallbackError);
      throw error;
    }
  }
}

