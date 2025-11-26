import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FirmaPro - Editor de Firmas Digitales Profesionales",
  description: "Crea y gestiona tus firmas digitales profesionales en minutos. Herramienta intuitiva con múltiples plantillas y exportación HTML.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

