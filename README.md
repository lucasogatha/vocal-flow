# VocalFlow

MicroSaaS para professores de canto acompanharem o estudo dos alunos entre uma aula e outra.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Supabase (Auth + Postgres + RLS) · React Hook Form · Zod

---

## Como rodar localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Copie `.env.local.example` para `.env.local` e preencha as credenciais do Supabase (e opcionalmente `NEXT_PUBLIC_SITE_URL`).
3. No SQL Editor do seu projeto Supabase, rode **todas** as migrations em `supabase/migrations/`, em ordem numérica (0001 → 0009).
4. Rode o seed da Biblioteca de Exercícios: `supabase/seed.sql`.
5. Inicie o projeto:
   ```bash
   npm run dev
   ```

## Scripts disponíveis

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Roda o build de produção localmente |
| `npm run lint` | ESLint (`next/core-web-vitals`) |
| `npm run typecheck` | Checagem de tipos TypeScript, sem gerar arquivos |

---

## Checklist de produção

Antes de colocar em produção, rode e confira cada item:

- [ ] `npm run typecheck` — sem erros
- [ ] `npm run lint` — sem erros
- [ ] `npm run build` — build de produção completa sem erros
- [ ] Todas as migrations (`0001` a `0009`) rodadas no projeto Supabase de produção, em ordem
- [ ] `supabase/seed.sql` rodado no projeto de produção
- [ ] Variáveis de ambiente configuradas no host (ver seção abaixo)
- [ ] Confirmação de e-mail do Supabase Auth revisada (habilitada ou desabilitada, conforme desejado) em Authentication → Settings
- [ ] Testado o fluxo completo: cadastro de professor → cadastro de aluno → envio de homework → ativação de conta do aluno → conclusão → volta ao painel do professor

### Variáveis de ambiente

| Variável | Obrigatória | Onde encontrar |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | Painel Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | Painel Supabase → Settings → API |
| `NEXT_PUBLIC_SITE_URL` | Recomendada | URL pública do deploy (ex: `https://app.vocalflow.com.br`) |
| `RESEND_API_KEY` | Não | Ativa o envio de e-mails de notificação (resend.com/api-keys) |
| `RESEND_FROM_EMAIL` | Não | Remetente dos e-mails; sem preencher, usa o domínio de teste do Resend |

Este projeto **não usa Service Role Key** — todo acesso a dados passa pela chave anônima e por Row Level Security (RLS). Isso é uma decisão de arquitetura deliberada, não um esquecimento.

### Notificações por e-mail

Usa [Resend](https://resend.com) + [React Email](https://react.email). Dois disparos automáticos:
- Aluno recebe e-mail ao receber um homework (aula ou exercícios)
- Professor recebe e-mail quando um aluno conclui um homework

Sem `RESEND_API_KEY` configurada, o app funciona normalmente — os e-mails simplesmente não são enviados (aviso no log). Templates em `emails/`.

### Performance

- Fonte carregada via `next/font/google` (self-hosted pelo Next, sem chamada externa em runtime)
- `reactStrictMode` ativado
- `poweredByHeader` desativado
- Todas as páginas autenticadas são dinâmicas por natureza (usam cookies de sessão) — não há necessidade de configurar revalidação manual
- Paginação em todas as listagens (Alunos, Aulas, Exercícios, Homeworks)

### SEO / Metadata

VocalFlow é um app autenticado, não um site de conteúdo público — por isso:
- `app/robots.ts` bloqueia indexação de todo o site
- `metadata.robots` no layout raiz reforça `index: false, follow: false`
- Metadata básica (título, descrição, `metadataBase`, `theme-color`) configurada em `app/layout.tsx`

### Ícones e Manifest

- `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico` — gerados a partir da identidade visual do app (cor de destaque `#5E6AD2`)
- `app/manifest.ts` — Web App Manifest básico (nome, cores, ícones)

Se a marca/identidade visual mudar, regenere esses arquivos — eles não são baixados de lugar nenhum, foram desenhados programaticamente para este projeto.

---

## Checklist de Deploy na Vercel

1. Importe o repositório no [dashboard da Vercel](https://vercel.com/new)
2. Framework preset: **Next.js** (detectado automaticamente)
3. Build command: `next build` (padrão, não precisa alterar)
4. Em **Settings → Environment Variables**, adicione para os ambientes de Production (e Preview, se quiser testar antes):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (a URL que a Vercel vai atribuir, ou seu domínio customizado)
5. Confirme que o projeto Supabase de produção já rodou todas as migrations + o seed (seção acima)
6. Clique em **Deploy**
7. Depois do primeiro deploy, se for usar um domínio próprio: configure em **Settings → Domains** e atualize `NEXT_PUBLIC_SITE_URL`
8. Teste o fluxo de login/cadastro apontando para o domínio final antes de divulgar

A Vercel **não precisa** do `Dockerfile` deste repositório — ele existe apenas como opção para quem quiser self-hostar em outro ambiente (VPS, Cloud Run, etc.).

---

## Docker (opcional, não necessário para Vercel)

```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=... \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  --build-arg NEXT_PUBLIC_SITE_URL=... \
  -t vocalflow .

docker run -p 3000:3000 vocalflow
```

---

## Estrutura do banco (Supabase)

Migrations em `supabase/migrations/`, nesta ordem:

| Arquivo | Conteúdo |
|---|---|
| `0001` | Tabela `students` + RLS |
| `0002` | Tabela `lessons` (Biblioteca de Aulas) + RLS |
| `0003` | Tabela `assignments` (envio de aula a aluno) + RLS |
| `0004` | Vínculo de conta do aluno por e-mail + RLS |
| `0005` | Rastreamento de último acesso do aluno |
| `0006` | Tabela `exercises` (Biblioteca de Exercícios) + RLS |
| `0007` | Tabelas `homeworks` e `homework_exercises` + RLS |
| `0008` | Acesso do aluno aos próprios homeworks personalizados |
| `0009` | Correções de segurança: triggers de restrição de coluna, e-mail case-insensitive, índices de performance |
| `0010` | Tabelas `plans` e `subscriptions` (sistema de assinaturas) |
| `0011` | Tabela `profiles` (sincronizada de `auth.users` via trigger), necessária para notificações por e-mail entre aluno e professor |
| `0012` | Painel administrativo: `profiles.is_admin`, RLS de leitura ampliada para admins, tabela `admin_logs` |
| `0013` | Traduz os 30 exercícios da Biblioteca para espanhol (atualiza em vez de recriar, preservando ids) |
| `0014` | Traduz as features dos planos (`plans`) para espanhol |
| `0015` | Traduz as mensagens de erro dos triggers de segurança para espanhol |

### Promovendo o primeiro administrador

Não existe nenhuma forma de se tornar admin pelo próprio app — é proposital (ver comentário na migration `0012`). Depois que a pessoa já tiver uma conta normal (professor ou aluno), rode no SQL Editor:

```sql
update profiles set is_admin = true where email = 'seu@email.com';
```

O painel fica em `/admin`, acessível só por quem tiver `is_admin = true`.

`supabase/seed.sql` popula os 30 exercícios nativos da Biblioteca de Exercícios (idempotente).

## Estrutura do projeto

```
app/(auth)/         páginas de login, cadastro e ativação de conta
app/(teacher)/      área do professor (dashboard, alunos, aulas, exercícios, homeworks)
app/(student)/      portal do aluno
components/ui/      primitivas reutilizáveis (Button, Card, Input, Skeleton, Toast...)
components/         componentes por domínio (students, lessons, exercises, homeworks...)
services/           acesso a dados (Supabase), organizado por entidade
validations/        schemas Zod
lib/                utilitários e helpers compartilhados (auth-guard, db-helpers, paginação...)
hooks/              hooks de cliente reutilizáveis (ex: useCompleteAction)
supabase/           migrations e seed do banco
```

## Status

Funcionalidades implementadas: autenticação (professor e aluno), cadastro e acompanhamento de alunos, Biblioteca de Aulas, Biblioteca de Exercícios, dois sistemas de envio de homework (por aula única e por múltiplos exercícios), portal do aluno com conclusão de treinos, dashboard com métricas reais, e uma auditoria de segurança/performance já aplicada.
