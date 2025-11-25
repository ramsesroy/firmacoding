import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FirmaCoding - Editor de Firmas Digitales",
  description: "Crea y gestiona tus firmas digitales de forma profesional",
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

