-- Biblioteca de aulas, compartilhada entre todos os professores.
create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  objective text not null,
  exercises text[] not null default '{}',
  homework text not null,
  order_index integer not null,
  created_at timestamptz not null default now()
);

alter table lessons enable row level security;

-- Qualquer usuário autenticado (professor) pode visualizar a biblioteca.
-- A escrita (importação das aulas) será feita diretamente pelo SQL Editor,
-- fora do fluxo da aplicação, então nenhuma policy de insert/update/delete
-- é criada aqui neste momento.
create policy "Authenticated users can view lessons"
  on lessons for select
  using (auth.role() = 'authenticated');
