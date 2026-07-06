-- Traduz as mensagens de erro dos triggers de segurança (migrations 0009
-- e 0010) para espanhol. São mensagens de casos extremos (só aparecem se
-- alguém tentar burlar a aplicação via chamada direta à API), mas
-- mantidas em espanhol por consistência com o resto do produto.
-- "create or replace function" é seguro de rodar de novo — só troca o
-- corpo da função, sem afetar os triggers já associados a ela.

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
      raise exception 'No está permitido modificar esos campos del propio registro.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

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
      raise exception 'Los alumnos solo pueden actualizar el estado de finalización del homework.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

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
      raise exception 'Los alumnos solo pueden actualizar el estado de finalización del homework.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

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
      raise exception 'Los alumnos solo pueden marcar el ejercicio como completado.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create or replace function enforce_student_limit()
returns trigger as $$
declare
  plan_limit integer;
  current_count integer;
begin
  select p.student_limit into plan_limit
  from subscriptions s
  join plans p on p.slug = s.plan_slug
  where s.teacher_id = new.teacher_id;

  if plan_limit is not null then
    select count(*) into current_count
    from students
    where teacher_id = new.teacher_id;

    if current_count >= plan_limit then
      raise exception 'Límite de % alumnos del plan alcanzado.', plan_limit;
    end if;
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;
