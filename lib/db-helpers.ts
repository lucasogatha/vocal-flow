import { createClient } from "@/lib/supabase/server";

// Tipagem pragmática: o query builder do Supabase muda de forma a cada
// tabela/select, e tipar isso genericamente exigiria os tipos gerados via
// `supabase gen types` (não disponível neste projeto). Preferimos esse
// escape hatch documentado a duplicar a mesma consulta de contagem em
// cada service.

type QueryFilter = (query: any) => any;

// Conta linhas de uma tabela aplicando os filtros passados. Elimina a
// repetição de ".select('*', { count: 'exact', head: true })" +
// tratamento de erro que existia em cada função de contagem do projeto.
export async function countRows(
  table: string,
  applyFilters: QueryFilter
): Promise<number> {
  const supabase = createClient();

  const query = applyFilters(
    supabase.from(table).select("*", { count: "exact", head: true })
  );

  const { count, error } = await query;

  if (error) {
    console.error(error);
    return 0;
  }

  return count ?? 0;
}

// Agrupa uma lista de linhas pela chave informada, contando ocorrências.
// Usado para transformar "todas as linhas de N professores" em "contagem
// por professor" sem uma query por professor (evita N+1).
export function countByKey<T extends Record<string, unknown>>(
  rows: T[],
  key: keyof T
): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const row of rows) {
    const value = String(row[key]);
    counts[value] = (counts[value] ?? 0) + 1;
  }

  return counts;
}
