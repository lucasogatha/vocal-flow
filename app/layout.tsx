import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Em produção, defina NEXT_PUBLIC_SITE_URL nas variáveis de ambiente
// (ex: https://app.vocalflow.com) para que links absolutos e metadados
// de compartilhamento fiquem corretos. Sem essa variável, cai em localhost
// apenas como fallback de desenvolvimento.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "VocalFlow",
    template: "%s · VocalFlow",
  },
  description: "Seguimiento de entrenamiento vocal entre profesor y alumno.",
  applicationName: "VocalFlow",
  // App autenticado: não há valor em SEO de conteúdo, então pedimos para
  // não indexar (reforça o robots.ts, que já bloqueia tudo).
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#5E6AD2",
};

// Roda antes da hidratação do React, direto no <head>, para aplicar o
// tema salvo (ou a preferência do sistema) sem um "flash" do tema errado.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("vocalflow-theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (!stored && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-419" className={inter.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
