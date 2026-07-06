-- Homework personalizado: um professor monta, para um aluno específico,
-- um conjunto de exercícios da Biblioteca de Exercícios (1 a 10 por
-- homework). Isso é independente das "assignments" (aula única da
-- Biblioteca de Aulas) que já existiam antes.

create table if not exists homeworks (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  name text not null,
  due_date date not null,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'completed')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table homeworks enable row level security;

create policy "Teachers can view their own homeworks"
  on homeworks for select
  using (auth.uid() = teacher_id);

create policy "Teachers can insert their own homeworks"
  on homeworks for insert
  with check (auth.uid() = teacher_id);

create policy "Teachers can update their own homeworks"
  on homeworks for update
  using (auth.uid() = teacher_id);

create policy "Teachers can delete their own homeworks"
  on homeworks for delete
  using (auth.uid() = teacher_id);

-- Tabela de junção: quais exercícios (e em qual ordem) compõem cada homework.
create table if not exists homework_exercises (
  id uuid primary key default gen_random_uuid(),
  homework_id uuid not null references homeworks(id) on delete cascade,
  exercise_id uuid not null references exercises(id) on delete cascade,
  position integer not null
);

alter table homework_exercises enable row level security;

create policy "Teachers can view exercises of their own homeworks"
  on homework_exercises for select
  using (
    exists (
      select 1 from homeworks
      where homeworks.id = homework_exercises.homework_id
      and homeworks.teacher_id = auth.uid()
    )
  );

create policy "Teachers can insert exercises into their own homeworks"
  on homework_exercises for insert
  with check (
    exists (
      select 1 from homeworks
      where homeworks.id = homework_exercises.homework_id
      and homeworks.teacher_id = auth.uid()
    )
  );

create policy "Teachers can delete exercises from their own homeworks"
  on homework_exercises for delete
  using (
    exists (
      select 1 from homeworks
      where homeworks.id = homework_exercises.homework_id
      and homeworks.teacher_id = auth.uid()
    )
  );
