import { createClient } from "@/lib/supabase/server";
import { countRows } from "@/lib/db-helpers";
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

// Garante que o professor tenha sua própria cópia da Biblioteca de
// Exercícios. Se ainda não tiver nenhum exercício, clona o "molde"
// (exercícios com teacher_id nulo) para a conta dele. Idempotente e
// seguro contra corridas simultâneas, no mesmo espírito de
// ensureSubscription/ensureStudentLink.
export async function ensureExerciseLibrary(teacherId: string): Promise<void> {
  const supabase = createClient();

  const { count, error: countError } = await supabase
    .from("exercises")
    .select("*", { count: "exact", head: true })
    .eq("teacher_id", teacherId);

  if (countError) {
    console.error(countError);
    return;
  }

  if (count && count > 0) {
    return;
  }

  const { data: templates, error: templatesError } = await supabase
    .from("exercises")
    .select("*")
    .is("teacher_id", null);

  if (templatesError || !templates) {
    console.error(templatesError);
    return;
  }

  const rows = templates.map((template) => ({
    title: template.title,
    category: template.category,
    objective: template.objective,
    description: template.description,
    duration_minutes: template.duration_minutes,
    level: template.level,
    tags: template.tags,
    order_index: template.order_index,
    teacher_id: teacherId,
  }));

  const { error: insertError } = await supabase.from("exercises").insert(rows);

  if (insertError && insertError.code !== "23505") {
    // 23505 = unique violation: outra requisição em paralelo já criou a
    // cópia. Não é um erro real.
    console.error(insertError);
  }
}

type GetExercisesParams = {
  teacherId: string;
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

// Lista (com busca, filtros e paginação) os exercícios da biblioteca do
// professor.
export async function getExercises({
  teacherId,
  search,
  category,
  level,
  page = 1,
  pageSize = 9,
}: GetExercisesParams): Promise<GetExercisesResult> {
  const supabase = createClient();

  let query = supabase
    .from("exercises")
    .select("*", { count: "exact" })
    .eq("teacher_id", teacherId);

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

// Busca o próximo order_index disponível NA BIBLIOTECA DESSE professor.
async function getNextExerciseOrderIndex(teacherId: string): Promise<number> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("exercises")
    .select("order_index")
    .eq("teacher_id", teacherId)
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return 1;
  }

  return data.order_index + 1;
}

// Cria um exercício personalizado na biblioteca do professor.
export async function insertExercise(input: {
  teacherId: string;
  title: string;
  category: ExerciseCategory;
  objective: string;
  description: string;
  duration_minutes: 5 | 10 | 15;
  level: ExerciseLevel;
  tags: string[];
}): Promise<{ error: unknown }> {
  const supabase = createClient();
  const orderIndex = await getNextExerciseOrderIndex(input.teacherId);

  const { error } = await supabase.from("exercises").insert({
    title: input.title,
    category: input.category,
    objective: input.objective,
    description: input.description,
    duration_minutes: input.duration_minutes,
    level: input.level,
    tags: input.tags,
    order_index: orderIndex,
    teacher_id: input.teacherId,
  });

  return { error };
}

// Conta em quantos homeworks este exercício está sendo usado atualmente.
// Como agora cada professor tem sua própria cópia, isso reflete o uso
// real e completo (não há mais exercícios compartilhados entre contas).
export async function countHomeworksUsingExercise(
  exerciseId: string
): Promise<number> {
  return countRows("homework_exercises", (query) =>
    query.eq("exercise_id", exerciseId)
  );
}

// Busca um exercício específico pelo id (a RLS garante que só é possível
// ver o próprio, ou o do professor do aluno logado).
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
