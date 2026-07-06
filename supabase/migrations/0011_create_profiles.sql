-- Espelho mínimo de auth.users, sincronizado automaticamente por trigger.
-- Existe para permitir que um usuário busque o e-mail/nome de OUTRO
-- usuário (ex: aluno precisa notificar o professor) sem precisar da
-- Service Role Key, que este projeto deliberadamente não usa.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  role text not null check (role in ('teacher', 'student')),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- Necessário para notificações cruzadas (aluno -> professor e vice-versa).
-- Trade-off deliberado: expõe e-mail/nome a qualquer usuário autenticado
-- que já conheça o UUID de outro — UUIDs não são adivinháveis, mas vale
-- registrar isso como decisão consciente, não descuido.
create policy "Authenticated users can view profiles"
  on profiles for select
  using (auth.role() = 'authenticated');

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'name',
    coalesce(new.raw_user_meta_data ->> 'role', 'teacher')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Backfill: contas criadas antes deste trigger existir.
insert into public.profiles (id, email, name, role)
select
  id,
  email,
  raw_user_meta_data ->> 'name',
  coalesce(raw_user_meta_data ->> 'role', 'teacher')
from auth.users
on conflict (id) do nothing;
