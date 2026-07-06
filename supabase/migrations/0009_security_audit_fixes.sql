-- ============================================================
-- 1) Triggers que restringem quais colunas um ALUNO pode alterar
--    quando a UPDATE não vem do professor proprietário. As policies
--    de RLS já restringem QUAIS LINHAS podem ser tocadas; estes
--    triggers restringem QUAIS COLUNAS, fechando a lacuna de um
--    aluno alterar campos que não deveria (via API direta).
-- ============================================================

create or replace function guard_student_self_update()
returns trigger as $$
begin
  if auth.uid() is distinct from old.teacher_id then
    if new.name is distinct from old.name
      or new.email is distinct from old.email
      or new.phone is distinct from old.phone
      or new.teacher_id is distinct from old.teacher_id
      or new.created_at is distinct from old.created_at
    then
      raise exception 'Não é permitido alterar esses campos do próprio cadastro.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists guard_student_self_update on students;
create trigger guard_student_self_update
  before update on students
  for each row execute function guard_student_self_update();

create or replace function guard_assignment_self_update()
returns trigger as $$
begin
  if auth.uid() is distinct from old.teacher_id then
    if new.student_id is distinct from old.student_id
      or new.lesson_id is distinct from old.lesson_id
      or new.teacher_id is distinct from old.teacher_id
      or new.due_date is distinct from old.due_date
      or new.teacher_notes is distinct from old.teacher_notes
      or new.assigned_at is distinct from old.assigned_at
    then
      raise exception 'Alunos só podem atualizar o status de conclusão do homework.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists guard_assignment_self_update on assignments;
create trigger guard_assignment_self_update
  before update on assignments
  for each row execute function guard_assignment_self_update();

create or replace function guard_homework_self_update()
returns trigger as $$
begin
  if auth.uid() is distinct from old.teacher_id then
    if new.student_id is distinct from old.student_id
      or new.teacher_id is distinct from old.teacher_id
      or new.name is distinct from old.name
      or new.objective is distinct from old.objective
      or new.due_date is distinct from old.due_date
      or new.notes is distinct from old.notes
      or new.created_at is distinct from old.created_at
    then
      raise exception 'Alunos só podem atualizar o status de conclusão do homework.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists guard_homework_self_update on homeworks;
create trigger guard_homework_self_update
  before update on homeworks
  for each row execute function guard_homework_self_update();

create or replace function guard_homework_exercise_self_update()
returns trigger as $$
declare
  owning_teacher_id uuid;
begin
  select teacher_id into owning_teacher_id from homeworks where id = old.homework_id;

  if auth.uid() is distinct from owning_teacher_id then
    if new.homework_id is distinct from old.homework_id
      or new.exercise_id is distinct from old.exercise_id
      or new.position is distinct from old.position
    then
      raise exception 'Alunos só podem marcar o exercício como concluído.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists guard_homework_exercise_self_update on homework_exercises;
create trigger guard_homework_exercise_self_update
  before update on homework_exercises
  for each row execute function guard_homework_exercise_self_update();

-- ============================================================
-- 2) Comparação de e-mail case-insensitive no vínculo aluno-conta
-- ============================================================

drop policy if exists "Students can find their own unclaimed record by email" on students;
create policy "Students can find their own unclaimed record by email"
  on students for select
  using (
    user_id is null
    and lower(email) = lower(auth.jwt() ->> 'email')
  );

drop policy if exists "Students can claim their own record" on students;
create policy "Students can claim their own record"
  on students for update
  using (
    user_id is null
    and lower(email) = lower(auth.jwt() ->> 'email')
  )
  with check (
    user_id = auth.uid()
  );

-- ============================================================
-- 3) Índices em colunas usadas em praticamente toda query do app
-- ============================================================

create index if not exists idx_students_teacher_id on students(teacher_id);
create index if not exists idx_students_email on students(email);

create index if not exists idx_assignments_teacher_id on assignments(teacher_id);
create index if not exists idx_assignments_student_id on assignments(student_id);
create index if not exists idx_assignments_status on assignments(status);
create index if not exists idx_assignments_due_date on assignments(due_date);

create index if not exists idx_homeworks_teacher_id on homeworks(teacher_id);
create index if not exists idx_homeworks_student_id on homeworks(student_id);
create index if not exists idx_homeworks_status on homeworks(status);
create index if not exists idx_homeworks_due_date on homeworks(due_date);

create index if not exists idx_homework_exercises_homework_id on homework_exercises(homework_id);
create index if not exists idx_homework_exercises_exercise_id on homework_exercises(exercise_id);
