import { createClient } from "@/lib/supabase/server";
import type { Plan } from "@/types/plan";

// Lista os planos disponíveis (Starter, Pro), ordenados por preço.
export async function getPlans(): Promise<Plan[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .order("price_cents", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return (data as Plan[]) ?? [];
}
