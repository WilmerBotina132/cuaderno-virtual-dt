import type { Metadata } from "next";
import { Barlow_Condensed, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

import { SITE } from "@/lib/site";

import "./globals.scss";

// Condensada en mayusculas: la letra de los rotulos y las placas de taller.
const display = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// Cuerpo de texto: dibujada sobre retícula, legible en parrafos largos.
const cuerpo = IBM_Plex_Sans({
  variable: "--font-cuerpo",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Monoespaciada para los campos del cajetin, fechas y numeros de lamina.
const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Las variables de fuente van en <html> porque globals.scss las consume
    // desde :root; si se declaran en <body>, `var(--font-display)` no existe
    // todavia al calcular :root y toda la tipografia se cae al valor por defecto.
    <html
      lang="es"
      className={`${display.variable} ${cuerpo.variable} ${mono.variable}`}
    >
      <head>
        {/* Sin JavaScript no hay animacion de entrada, pero el contenido tiene
            que verse igual: esto anula el estado inicial transparente. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
