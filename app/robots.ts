import type { MetadataRoute } from "next";

// VocalFlow é um aplicativo autenticado, não um site de conteúdo público —
// não há valor em ser indexado por buscadores, e evita expor rotas internas.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
