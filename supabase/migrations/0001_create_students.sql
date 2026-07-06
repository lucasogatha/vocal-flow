-- Tabela de alunos, vinculados ao professor que os cadastrou.
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  created_at timestamptz not null default now()
);

alter table students enable row level security;

-- Um professor só pode ver, criar, editar e excluir os próprios alunos.
create policy "Teachers can view their own students"
  on students for select
  using (auth.uid() = teacher_id);

create policy "Teachers can insert their own students"
  on students for insert
  with check (auth.uid() = teacher_id);

create policy "Teachers can update their own students"
  on students for update
  using (auth.uid() = teacher_id);

create policy "Teachers can delete their own students"
  on students for delete
  using (auth.uid() = teacher_id);
