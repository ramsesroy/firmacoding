import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Signature For Me - Editor de Firmas Digitales Profesionales",
  description: "Crea y gestiona tus firmas digitales profesionales en minutos. Herramienta intuitiva con múltiples plantillas y exportación HTML.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

