-- Permite que professores excluam exercícios da Biblioteca (tanto os 30
-- nativos quanto os criados por professores). Mesmo critério da policy
-- de criação (migration 0016): baseado em profiles.role, não em
-- user_metadata.
create policy "Teachers can delete exercises"
  on exercises for delete
  using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'teacher'
    )
  );
