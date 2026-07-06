-- ============================================================
-- Planos disponíveis. Conteúdo estático, gerenciado via SQL/seed,
-- não pela aplicação — mesmo padrão de "lessons" e "exercises".
-- ============================================================
create table if not exists plans (
  slug text primary key check (slug in ('starter', 'pro')),
  name text not null,
  price_cents integer not null,
  currency text not null default 'USD',
  student_limit integer, -- null = ilimitado
  features text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table plans enable row level security;

create policy "Authenticated users can view plans"
  on plans for select
  using (auth.role() = 'authenticated');

insert into plans (slug, name, price_cents, currency, student_limit, features) values
  (
    'starter',
    'Starter',
    790,
    'USD',
    10,
    array[
      'Cadastro de alunos',
      'Biblioteca de exercícios',
      'Criação de Homeworks',
      'Portal do Aluno',
      'Acompanhamento de progresso',
      'Dashboard do Professor'
    ]
  ),
  (
    'pro',
    'Pro',
    1490,
    'USD',
    null,
    array[
      'Cadastro de alunos',
      'Biblioteca de exercícios',
      'Criação de Homeworks',
      'Portal do Aluno',
      'Acompanhamento de progresso',
      'Dashboard do Professor'
    ]
  )
on conflict (slug) do nothing;

-- ============================================================
-- Assinatura de cada professor. Uma linha por professor (unique).
-- Os campos stripe_* e current_period_end já existem desde já,
-- vazios, para que a integração futura com o Stripe não precise
-- de nenhuma alteração de schema — só passar a preenchê-los via
-- webhook.
-- ============================================================
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null unique references auth.users(id) on delete cascade,
  plan_slug text not null references plans(slug),
  status text not null default 'active' check (status in ('active', 'past_due', 'canceled', 'incomplete')),
  provider text not null default 'manual' check (provider in ('manual', 'stripe')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table subscriptions enable row level security;

create policy "Teachers can view their own subscription"
  on subscriptions for select
  using (auth.uid() = teacher_id);

-- Só permite ao professor criar a PRÓPRIA assinatura inicial, e só no
-- formato "Starter manual". Nenhuma policy de UPDATE existe para o
-- cliente: mudar de plano ou status hoje só é possível via SQL Editor
-- (e, no futuro, via webhook do Stripe usando a service role, que
-- ignora RLS). Isso impede que alguém se auto-promova a Pro de graça.
create policy "Teachers can create their own starter subscription"
  on subscriptions for insert
  with check (
    auth.uid() = teacher_id
    and plan_slug = 'starter'
    and status = 'active'
    and provider = 'manual'
  );

create index if not exists idx_subscriptions_teacher_id on subscriptions(teacher_id);

-- ============================================================
-- Trava do limite de alunos a nível de banco. A Server Action já checa
-- isso antes de inserir (para mostrar o modal de upgrade com boa UX),
-- mas essa checagem não é atômica — duas requisições simultâneas
-- poderiam passar pela checagem da aplicação ao mesmo tempo. Este
-- trigger garante o limite mesmo nesse cenário.
-- ============================================================
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

  -- Sem limite definido (plano Pro, ou assinatura ainda não criada) = sem restrição.
  if plan_limit is not null then
    select count(*) into current_count
    from students
    where teacher_id = new.teacher_id;

    if current_count >= plan_limit then
      raise exception 'Limite de % alunos do plano atingido.', plan_limit;
    end if;
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists enforce_student_limit on students;
create trigger enforce_student_limit
  before insert on students
  for each row execute function enforce_student_limit();
