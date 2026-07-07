-- ============================================================
-- Cada professor passa a ter sua PRÓPRIA cópia da Biblioteca de
-- Exercícios, em vez de uma biblioteca 100% compartilhada.
--
-- Ordem importante (isso foi corrigido em relação a uma versão anterior
-- deste arquivo que dava erro): a constraint antiga de título único
-- GLOBAL precisa ser removida ANTES de clonar os exercícios, senão duas
-- cópias com o mesmo título (uma por professor) esbarram nela.
-- ============================================================

-- 1) Adiciona teacher_id (nullable — null = "molde", nunca pertence a
--    um professor específico, só existe para ser copiado).
alter table exercises add column if not exists teacher_id uuid references auth.users(id) on delete cascade;
create index if not exists idx_exercises_teacher_id on exercises(teacher_id);

-- 2) Substitui a constraint de título único GLOBAL por índices únicos
--    parciais — título único dentro do molde, e único dentro da
--    biblioteca de cada professor (não mais entre professores).
--    Isso PRECISA vir antes da clonagem abaixo.
alter table exercises drop constraint if exists exercises_title_key;

create unique index if not exists exercises_template_title_key
  on exercises (title) where teacher_id is null;

create unique index if not exists exercises_teacher_title_key
  on exercises (teacher_id, title) where teacher_id is not null;

-- 3) Clona o molde atual para cada professor já existente que AINDA NÃO
--    tenha sua própria cópia (checagem explícita — seguro para rodar de
--    novo, mesmo que uma execução anterior tenha ficado pela metade), e
--    remapeia os homework_exercises já criados por esse professor para
--    apontar para a cópia dele.
do $$
declare
  teacher_record record;
  template_record record;
  new_exercise_id uuid;
begin
  for teacher_record in select id from profiles where role = 'teacher' loop

    if exists (select 1 from exercises where teacher_id = teacher_record.id) then
      continue;
    end if;

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

-- 4) Novas policies de RLS, escopadas por professor.
drop policy if exists "Authenticated users can view exercises" on exercises;
drop policy if exists "Teachers can create exercises" on exercises;
drop policy if exists "Teachers can delete exercises" on exercises;
drop policy if exists "Teachers can view their own exercises" on exercises;
drop policy if exists "Teachers can create their own exercises" on exercises;
drop policy if exists "Teachers can update their own exercises" on exercises;
drop policy if exists "Teachers can delete their own exercises" on exercises;
drop policy if exists "Students can view their teacher's exercises" on exercises;
drop policy if exists "Admins can view all exercises" on exercises;

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
