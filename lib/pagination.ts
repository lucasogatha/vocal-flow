// Monta a URL de uma página de listagem preservando os filtros ativos.
// Usado por Meus Alunos, Biblioteca de Aulas, Exercícios e Homeworks para
// evitar reimplementar a mesma lógica de query string em cada página.
export function buildPaginationHref(
  basePath: string,
  params: Record<string, string | undefined>,
  page: number
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  searchParams.set("page", String(page));

  return `${basePath}?${searchParams.toString()}`;
}
