-- Homeworks (aulas atribuídas a um aluno específico).
create table if not exists assignments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'completed')),
  due_date date not null,
  assigned_at timestamptz not null default now(),
  completed_at timestamptz,
  teacher_notes text
);

alter table assignments enable row level security;

create policy "Teachers can view their own assignments"
  on assignments for select
  using (auth.uid() = teacher_id);

create policy "Teachers can insert their own assignments"
  on assignments for insert
  with check (auth.uid() = teacher_id);

create policy "Teachers can update their own assignments"
  on assignments for update
  using (auth.uid() = teacher_id);

create policy "Teachers can delete their own assignments"
  on assignments for delete
  using (auth.uid() = teacher_id);
