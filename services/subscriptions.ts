import { createClient } from "@/lib/supabase/server";
import { countStudentsByTeacher } from "@/services/students";
import { logEvent } from "@/services/logs";
import type { SubscriptionWithPlan } from "@/types/subscription";

// Garante que o professor tenha uma assinatura. Se ainda não tiver (ex:
// acabou de se cadastrar), cria automaticamente uma assinatura Starter
// "manual" (sem cobrança real — ver nota na migration 0010). Idempotente:
// seguro para chamar em toda visita à área do professor, mesmo que em
// paralelo (a constraint unique em teacher_id evita duplicatas).
export async function ensureSubscription(
  teacherId: string
): Promise<SubscriptionWithPlan | null> {
  const supabase = createClient();

  const { data: existing, error: existingError } = await supabase
    .from("subscriptions")
    .select("*, plan:plans(*)")
    .eq("teacher_id", teacherId)
    .maybeSingle();

  if (existingError) {
    console.error(existingError);
  }

  if (existing) {
    return existing as unknown as SubscriptionWithPlan;
  }

  const { data: created, error: createError } = await supabase
    .from("subscriptions")
    .insert({
      teacher_id: teacherId,
      plan_slug: "starter",
      status: "active",
      provider: "manual",
    })
    .select("*, plan:plans(*)")
    .single();

  if (createError) {
    // Código 23505 = violação de unique constraint: outra requisição em
    // paralelo já criou a assinatura. Não é um erro real, só buscamos de
    // novo.
    if (createError.code === "23505") {
      const { data: retried } = await supabase
        .from("subscriptions")
        .select("*, plan:plans(*)")
        .eq("teacher_id", teacherId)
        .maybeSingle();
      return (retried as unknown as SubscriptionWithPlan) ?? null;
    }

    console.error(createError);
    return null;
  }

  await logEvent("teacher_provisioned", { id: teacherId }, {
    plan: "starter",
  });

  return created as unknown as SubscriptionWithPlan;
}

// Busca a assinatura do professor, sem criar uma nova caso não exista.
export async function getSubscriptionWithPlan(
  teacherId: string
): Promise<SubscriptionWithPlan | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*, plan:plans(*)")
    .eq("teacher_id", teacherId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data as unknown as SubscriptionWithPlan | null;
}

export type StudentLimitStatus = {
  limit: number | null;
  currentCount: number;
  canAddMore: boolean;
};

// Checagem central do limite de alunos do plano. Usada pela Server Action
// de cadastro de aluno para bloquear o 11º aluno no Starter.
export async function getStudentLimitStatus(
  teacherId: string
): Promise<StudentLimitStatus> {
  const subscription = await ensureSubscription(teacherId);
  const limit = subscription?.plan?.student_limit ?? null;
  const currentCount = await countStudentsByTeacher(teacherId);

  return {
    limit,
    currentCount,
    canAddMore: limit === null || currentCount < limit,
  };
}
