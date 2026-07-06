-- ============================================================
-- Papel de administrador. Vive em profiles (já é o espelho confiável de
-- auth.users) em vez de uma tabela separada. Sem NENHUMA policy de
-- update que permita a um usuário alterar isso em si mesmo — só é
-- setável via SQL Editor, manualmente, por quem tem acesso ao projeto
-- Supabase. Para promover o primeiro admin:
--
--   update profiles set is_admin = true where email = 'seu@email.com';
-- ============================================================
alter table profiles add column if not exists is_admin boolean not null default false;

create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and is_admin = true
  );
$$ language sql security definer stable set search_path = public;

-- Acesso de leitura ampliado para administradores, nas tabelas que o
-- painel precisa agregar. Professores e alunos continuam só vendo os
-- próprios dados — estas policies apenas ADICIONAM a visão do admin.
create policy "Admins can view all students"
  on students for select
  using (is_admin());

create policy "Admins can view all subscriptions"
  on subscriptions for select
  using (is_admin());

create policy "Admins can view all homeworks"
  on homeworks for select
  using (is_admin());

create policy "Admins can view all assignments"
  on assignments for select
  using (is_admin());

-- ============================================================
-- Log de eventos administrativos / auditoria leve. Cobre os eventos mais
-- relevantes do produto (não é uma instrumentação exaustiva de tudo).
-- ============================================================
create table if not exists admin_logs (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table admin_logs enable row level security;

create policy "Admins can view logs"
  on admin_logs for select
  using (is_admin());

-- Qualquer usuário autenticado pode registrar um log referente a si
-- mesmo (é assim que a aplicação grava eventos como "professor
-- provisionado" ou "homework concluído"). Não é possível registrar um
-- log em nome de outra pessoa.
create policy "Users can log their own actions"
  on admin_logs for insert
  with check (actor_id = auth.uid() or actor_id is null);

create index if not exists idx_admin_logs_created_at on admin_logs(created_at desc);
