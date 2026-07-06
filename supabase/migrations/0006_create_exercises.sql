-- Biblioteca nativa de exercícios de canto, compartilhada entre todos os
-- professores (mesmo padrão de "lessons").
create table if not exists exercises (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  category text not null check (category in (
    'Respiração',
    'Aquecimento Vocal',
    'Apoio Respiratório',
    'Afinação',
    'Voz de Peito',
    'Voz de Cabeça',
    'Voz Mista',
    'Extensão Vocal',
    'Ressonância',
    'Dicção'
  )),
  objective text not null,
  description text not null,
  duration_minutes integer not null check (duration_minutes in (5, 10, 15)),
  level text not null check (level in ('Iniciante', 'Intermediário', 'Avançado')),
  tags text[] not null default '{}',
  order_index integer not null,
  created_at timestamptz not null default now()
);

alter table exercises enable row level security;

-- Leitura para qualquer usuário autenticado. Sem policy de insert/update/
-- delete: o conteúdo é nativo e populado via seed, não pela aplicação.
create policy "Authenticated users can view exercises"
  on exercises for select
  using (auth.role() = 'authenticated');
