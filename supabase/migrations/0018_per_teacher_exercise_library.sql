-- ============================================================
-- Cada professor passa a ter sua PRÓPRIA cópia da Biblioteca de
-- Exercícios, em vez de uma biblioteca 100% compartilhada.
--
-- Estratégia:
-- 1) Adiciona teacher_id (nullable — null = "molde", nunca pertence a
--    um professor específico, só existe para ser copiado).
-- 2) Para cada professor JÁ EXISTENTE, clona todos os exercícios atuais
--    (o molde) para uma cópia própria, e remapeia os homework_exercises
--    já criados por esse professor para apontar para a cópia dele.
-- 3) Novas policies de RLS, escopadas por teacher_id.
-- 4) Índices únicos parciais (title único dentro do molde; título único
--    dentro de cada professor — não mais um título único globalmente).
-- ============================================================

alter table exercises add column if not exists teacher_id uuid references auth.users(id) on delete cascade;
create index if not exists idx_exercises_teacher_id on exercises(teacher_id);

-- Clona o molde atual para cada professor já existente, remapeando os
-- homework_exercises desse professor para a nova cópia.
do $$
declare
  teacher_record record;
  template_record record;
  new_exercise_id uuid;
begin
  for teacher_record in select id from profiles where role = 'teacher' loop
    for template_record in select * from exercises where teacher_id is null loop
      insert into exercises (
        title, category, objective, description, duration_minutes,
        level, tags, order_index, teacher_id
      )
      values (
        template_record.title, template_record.category, template_record.objective,
        template_record.description, template_record.duration_minutes,
        template_record.level, template_record.tags, template_record.order_index,
        teacher_record.id
      )
      returning id into new_exercise_id;

      update homework_exercises he
      set exercise_id = new_exercise_id
      from homeworks h
      where he.homework_id = h.id
        and h.teacher_id = teacher_record.id
        and he.exercise_id = template_record.id;
    end loop;
  end loop;
end $$;

-- Substitui a constraint de título único global por índices únicos
-- parciais: um título só precisa ser único DENTRO do molde, ou DENTRO
-- da biblioteca de um mesmo professor — não mais entre professores.
alter table exercises drop constraint if exists exercises_title_key;

create unique index if not exists exercises_template_title_key
  on exercises (title) where teacher_id is null;

create unique index if not exists exercises_teacher_title_key
  on exercises (teacher_id, title) where teacher_id is not null;

-- Novas policies de RLS, escopadas por professor.
drop policy if exists "Authenticated users can view exercises" on exercises;
drop policy if exists "Teachers can create exercises" on exercises;
drop policy if exists "Teachers can delete exercises" on exercises;

create policy "Teachers can view their own exercises"
  on exercises for select
  using (auth.uid() = teacher_id);

create policy "Teachers can create their own exercises"
  on exercises for insert
  with check (auth.uid() = teacher_id);

create policy "Teachers can update their own exercises"
  on exercises for update
  using (auth.uid() = teacher_id);

create policy "Teachers can delete their own exercises"
  on exercises for delete
  using (auth.uid() = teacher_id);

-- Alunos veem os exercícios da biblioteca do PRÓPRIO professor (para
-- conseguir abrir os homeworks que recebem).
create policy "Students can view their teacher's exercises"
  on exercises for select
  using (
    exists (
      select 1 from students
      where students.teacher_id = exercises.teacher_id
      and students.user_id = auth.uid()
    )
  );

-- Admin continua enxergando tudo, para o painel administrativo.
create policy "Admins can view all exercises"
  on exercises for select
  using (is_admin());
