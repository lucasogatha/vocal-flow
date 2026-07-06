import { createClient } from "@/lib/supabase/server";
import type { Lesson } from "@/types/lesson";

type SortOption = "order" | "title";

type GetLessonsParams = {
  search?: string;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
};

type GetLessonsResult = {
  lessons: Lesson[];
  totalCount: number;
};

// Lista (com busca, ordenação e paginação) as aulas da biblioteca.
export async function getLessons({
  search,
  sort = "order",
  page = 1,
  pageSize = 9,
}: GetLessonsParams): Promise<GetLessonsResult> {
  const supabase = createClient();

  let query = supabase.from("lessons").select("*", { count: "exact" });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  query =
    sort === "title"
      ? query.order("title", { ascending: true })
      : query.order("order_index", { ascending: true });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error(error);
    return { lessons: [], totalCount: 0 };
  }

  return { lessons: (data as Lesson[]) ?? [], totalCount: count ?? 0 };
}

// Busca uma aula específica pelo id.
export async function getLessonById(id: string): Promise<Lesson | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data as Lesson;
}
