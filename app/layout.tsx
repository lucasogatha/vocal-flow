import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-419" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
