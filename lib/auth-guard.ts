import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

// Busca o usuário autenticado atual. Centraliza o par
// createClient() + auth.getUser() que se repetia em praticamente toda
// página e Server Action do projeto.
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

type RequireTeacherResult =
  | { ok: true; userId: string }
  | { ok: false; message: string };

// Centraliza a checagem repetida em toda Server Action do professor:
// usuário autenticado + papel de professor. Reduz duplicação e garante
// que a mensagem de erro seja consistente em todo o app.
export async function requireTeacher(): Promise<RequireTeacherResult> {
  const user = await getCurrentUser();

  if (!user || user.user_metadata?.role !== "teacher") {
    return {
      ok: false,
      message: "Apenas professores podem realizar esta ação.",
    };
  }

  return { ok: true, userId: user.id };
}

type RequireUserResult =
  | { ok: true; userId: string; user: User }
  | { ok: false };

// Versão sem checagem de papel — usada pelas Server Actions do aluno, que
// não precisam validar um papel específico, só que alguém está logado.
export async function requireUser(): Promise<RequireUserResult> {
  const user = await getCurrentUser();

  if (!user) {
    return { ok: false };
  }

  return { ok: true, userId: user.id, user };
}
