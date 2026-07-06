-- Objetivo geral do homework (distinto do objetivo de cada exercício).
alter table homeworks add column if not exists objective text;

-- Conclusão de um exercício dentro de um homework específico.
alter table homework_exercises add column if not exists completed_at timestamptz;

-- Acesso do aluno aos próprios homeworks personalizados.
create policy "Students can view their own homeworks"
  on homeworks for select
  using (
    student_id in (select id from students where user_id = auth.uid())
  );

create policy "Students can update their own homeworks"
  on homeworks for update
  using (
    student_id in (select id from students where user_id = auth.uid())
  )
  with check (
    student_id in (select id from students where user_id = auth.uid())
  );

create policy "Students can view exercises of their own homeworks"
  on homework_exercises for select
  using (
    exists (
      select 1 from homeworks
      where homeworks.id = homework_exercises.homework_id
      and homeworks.student_id in (select id from students where user_id = auth.uid())
    )
  );

create policy "Students can update exercises of their own homeworks"
  on homework_exercises for update
  using (
    exists (
      select 1 from homeworks
      where homeworks.id = homework_exercises.homework_id
      and homeworks.student_id in (select id from students where user_id = auth.uid())
    )
  )
  with check (
    exists (
      select 1 from homeworks
      where homeworks.id = homework_exercises.homework_id
      and homeworks.student_id in (select id from students where user_id = auth.uid())
    )
  );
