-- Vincula o registro de aluno (criado pelo professor) à conta de login do aluno.
alter table students add column if not exists user_id uuid references auth.users(id);
create unique index if not exists students_user_id_key on students(user_id);

-- Permite que um usuário autenticado encontre seu próprio registro de aluno
-- ainda não vinculado, por e-mail (passo necessário para poder vinculá-lo).
create policy "Students can find their own unclaimed record by email"
  on students for select
  using (
    user_id is null
    and email = auth.jwt() ->> 'email'
  );

-- Permite que o aluno vincule (uma única vez) sua conta ao próprio registro.
create policy "Students can claim their own record"
  on students for update
  using (
    user_id is null
    and email = auth.jwt() ->> 'email'
  )
  with check (
    user_id = auth.uid()
  );

-- Permite que o aluno veja seus próprios dados depois de vinculado.
create policy "Students can view their own linked record"
  on students for select
  using (auth.uid() = user_id);

-- Aluno pode ver os próprios homeworks.
create policy "Students can view their own assignments"
  on assignments for select
  using (
    student_id in (
      select id from students where user_id = auth.uid()
    )
  );

-- Aluno pode marcar os próprios homeworks como concluídos.
create policy "Students can update their own assignments"
  on assignments for update
  using (
    student_id in (
      select id from students where user_id = auth.uid()
    )
  )
  with check (
    student_id in (
      select id from students where user_id = auth.uid()
    )
  );
