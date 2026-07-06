import { createClient } from "@/lib/supabase/client";
import type { LoginInput, RegisterInput } from "@/validations/auth.schema";

// Cadastra um novo professor. O papel "teacher" é o único que se
// auto-cadastra no MVP; alunos são cadastrados pelo professor depois.
export async function signUp({ name, email, password }: RegisterInput) {
  const supabase = createClient();

  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role: "teacher",
      },
    },
  });
}

export async function signIn({ email, password }: LoginInput) {
  const supabase = createClient();

  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  const supabase = createClient();

  return supabase.auth.signOut();
}

// Cria a conta de login de um aluno. O vínculo com o registro criado
// pelo professor acontece depois, no primeiro acesso ao portal
// (ver services/students.ts -> ensureStudentLink).
export async function signUpStudent({ email, password }: LoginInput) {
  const supabase = createClient();

  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: "student",
      },
    },
  });
}
