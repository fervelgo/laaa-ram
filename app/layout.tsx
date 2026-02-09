import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RAM | Repositorio de Artefactos Mesoamericanos",
  description:
    "Coleccion digital de artefactos arqueologicos mesoamericanos en 3D",
  keywords: ["arqueologia", "mesoamerica", "3D", "museo", "artefactos"],
  openGraph: {
    title: "RAM | Repositorio de Artefactos Mesoamericanos",
    description:
      "Coleccion digital de artefactos arqueologicos mesoamericanos en 3D",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
