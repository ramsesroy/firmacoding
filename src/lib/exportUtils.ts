import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Exporta una firma como imagen PNG
 */
export async function exportAsPNG(element: HTMLElement, filename: string = "firma"): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Mayor calidad
      logging: false,
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
    throw error;
  }
}

/**
 * Exporta una firma como PDF
 */
export async function exportAsPDF(element: HTMLElement, filename: string = "firma"): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
    } as any);

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 190; // Ancho máximo en mm para A4
    const pageHeight = 295; // Altura de página A4 en mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Error al exportar como PDF:", error);
    throw error;
  }
}

