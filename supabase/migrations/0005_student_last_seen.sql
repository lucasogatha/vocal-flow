-- Rastreamento de último acesso do aluno ao portal.
alter table students add column if not exists last_seen_at timestamptz;

-- Permite que o aluno já vinculado atualize seu próprio registro (hoje só
-- existia uma policy de update restrita ao momento do vínculo inicial,
-- quando user_id ainda era nulo). Necessária para gravar o "último acesso".
create policy "Students can update their own linked record"
  on students for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
