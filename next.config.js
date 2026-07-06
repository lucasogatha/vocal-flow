/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove o header "X-Powered-By: Next.js" (pequeno hardening, evita
  // expor detalhes de stack desnecessariamente).
  poweredByHeader: false,
  // "standalone" gera um build autocontido em .next/standalone, usado
  // pelo Dockerfile opcional deste projeto. Não afeta o deploy na Vercel,
  // que ignora essa opção e usa seu próprio pipeline de build.
  output: "standalone",
};

module.exports = nextConfig;
