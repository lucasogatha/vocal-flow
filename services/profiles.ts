import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/profile";

// Busca o perfil (e-mail/nome) de um usuário pelo id. Usado para
// notificações cruzadas — ex: aluno concluindo homework precisa saber o
// e-mail do professor, que não está disponível em nenhuma outra tabela
// sem a Service Role Key.
export async function getProfileById(userId: string): Promise<Profile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data as Profile | null;
}
