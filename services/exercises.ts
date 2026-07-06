import { createClient } from "@/lib/supabase/server";
import type { Exercise, ExerciseCategory, ExerciseLevel } from "@/types/exercise";

export const EXERCISE_CATEGORIES: ExerciseCategory[] = [
  "Respiración",
  "Calentamiento Vocal",
  "Apoyo Respiratorio",
  "Afinación",
  "Voz de Pecho",
  "Voz de Cabeza",
  "Voz Mixta",
  "Extensión Vocal",
  "Resonancia",
  "Dicción",
];

export const EXERCISE_LEVELS: ExerciseLevel[] = [
  "Principiante",
  "Intermedio",
  "Avanzado",
];

type GetExercisesParams = {
  search?: string;
  category?: string;
  level?: string;
  page?: number;
  pageSize?: number;
};

type GetExercisesResult = {
  exercises: Exercise[];
  totalCount: number;
};

// Lista (com busca, filtros e paginação) os exercícios da biblioteca.
export async function getExercises({
  search,
  category,
  level,
  page = 1,
  pageSize = 9,
}: GetExercisesParams): Promise<GetExercisesResult> {
  const supabase = createClient();

  let query = supabase.from("exercises").select("*", { count: "exact" });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }
  if (category) {
    query = query.eq("category", category);
  }
  if (level) {
    query = query.eq("level", level);
  }

  query = query.order("order_index", { ascending: true });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error(error);
    return { exercises: [], totalCount: 0 };
  }

  return { exercises: (data as Exercise[]) ?? [], totalCount: count ?? 0 };
}

// Busca um exercício específico pelo id.
export async function getExerciseById(id: string): Promise<Exercise | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data as Exercise;
}
