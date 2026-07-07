-- Permite que professores criem exercícios personalizados na Biblioteca.
-- Usa profiles.role (não user_metadata) para decidir quem é professor —
-- mais robusto, já que profiles é sincronizado por trigger no servidor.
create policy "Teachers can create exercises"
  on exercises for insert
  with check (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'teacher'
    )
  );
