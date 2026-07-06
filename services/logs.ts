import { createClient } from "@/lib/supabase/server";

// Registra um evento no log administrativo. Nunca lança erro para quem
// chama — falha ao logar não pode quebrar o fluxo principal do produto.
export async function logEvent(
  eventType: string,
  actor: { id: string | null; email?: string | null },
  metadata: Record<string, unknown> = {}
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("admin_logs").insert({
    event_type: eventType,
    actor_id: actor.id,
    actor_email: actor.email ?? null,
    metadata,
  });

  if (error) {
    console.error("Falha ao registrar log:", error);
  }
}
