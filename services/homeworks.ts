import { createClient } from "@/lib/supabase/server";
import type {
  Homework,
  HomeworkWithCount,
  HomeworkWithExercises,
} from "@/types/homework";

export type HomeworkOverviewStatus = "in_progress" | "completed" | "overdue";

export type HomeworkOverviewRow = {
  id: string;
  name: string;
  studentName: string;
  dueDate: string;
  status: HomeworkOverviewStatus;
  totalExercises: number;
  completedExercises: number;
  percentage: number;
};

type GetHomeworksOverviewParams = {
  teacherId: string;
  search?: string;
  status?: HomeworkOverviewStatus;
  studentId?: string;
  page?: number;
  pageSize?: number;
};

// Visão geral de todos os homeworks de um professor, com status derivado
// (em andamento / concluído / atrasado) e progresso calculado a partir dos
// exercícios. Filtro por status é aplicado em memória, já que "atrasado" e
// "em andamento" não são valores armazenados diretamente no banco.
export async function getHomeworksOverviewForTeacher({
  teacherId,
  search,
  status,
  studentId,
  page = 1,
  pageSize = 10,
}: GetHomeworksOverviewParams): Promise<{
  rows: HomeworkOverviewRow[];
  totalCount: number;
}> {
  const supabase = createClient();

  let query = supabase
    .from("homeworks")
    .select(
      "id, name, due_date, status, student:students(name), homework_exercises(completed_at)"
    )
    .eq("teacher_id", teacherId)
    .order("due_date", { ascending: true });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }
  if (studentId) {
    query = query.eq("student_id", studentId);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return { rows: [], totalCount: 0 };
  }

  const today = new Date().toISOString().split("T")[0];

  type HomeworkOverviewJoinRow = {
    id: string;
    name: string;
    due_date: string;
    status: string;
    student: { name: string } | null;
    homework_exercises: { completed_at: string | null }[];
  };

  const allRows: HomeworkOverviewRow[] = (
    (data ?? []) as unknown as HomeworkOverviewJoinRow[]
  ).map((row) => {
    const items = row.homework_exercises ?? [];
    const total = items.length;
    const completed = items.filter((item) => item.completed_at).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    let derivedStatus: HomeworkOverviewStatus;
    if (row.status === "completed") {
      derivedStatus = "completed";
    } else if (row.due_date < today) {
      derivedStatus = "overdue";
    } else {
      derivedStatus = "in_progress";
    }

    return {
      id: row.id,
      name: row.name,
      studentName: row.student?.name ?? "Aluno removido",
      dueDate: row.due_date,
      status: derivedStatus,
      totalExercises: total,
      completedExercises: completed,
      percentage,
    };
  });

  const filteredRows = status
    ? allRows.filter((row) => row.status === status)
    : allRows;

  const totalCount = filteredRows.length;
  const from = (page - 1) * pageSize;
  const rows = filteredRows.slice(from, from + pageSize);

  return { rows, totalCount };
}

// Cria um homework personalizado com os exercícios selecionados.
// Se a criação dos vínculos com os exercícios falhar, desfaz o homework
// para não deixar um registro vazio no banco.
export async function insertHomework(input: {
  teacherId: string;
  studentId: string;
  name: string;
  objective: string | null;
  dueDate: string;
  notes: string | null;
  exerciseIds: string[];
}): Promise<{ error: unknown }> {
  const supabase = createClient();

  const { data: homework, error: homeworkError } = await supabase
    .from("homeworks")
    .insert({
      teacher_id: input.teacherId,
      student_id: input.studentId,
      name: input.name,
      objective: input.objective,
      due_date: input.dueDate,
      notes: input.notes,
    })
    .select()
    .single();

  if (homeworkError || !homework) {
    return { error: homeworkError };
  }

  const rows = input.exerciseIds.map((exerciseId, index) => ({
    homework_id: homework.id,
    exercise_id: exerciseId,
    position: index + 1,
  }));

  const { error: linkError } = await supabase
    .from("homework_exercises")
    .insert(rows);

  if (linkError) {
    await supabase.from("homeworks").delete().eq("id", homework.id);
    return { error: linkError };
  }

  return { error: null };
}

// Lista os homeworks personalizados de um aluno, com a contagem de exercícios
// (usado na página do aluno, visão do professor).
export async function getHomeworksByStudent(
  studentId: string,
  teacherId: string
): Promise<HomeworkWithCount[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("homeworks")
    .select("*, homework_exercises(count)")
    .eq("student_id", studentId)
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  type HomeworkWithCountRow = Homework & {
    homework_exercises: { count: number }[];
  };

  return ((data ?? []) as unknown as HomeworkWithCountRow[]).map((row) => ({
    id: row.id,
    teacher_id: row.teacher_id,
    student_id: row.student_id,
    name: row.name,
    objective: row.objective,
    due_date: row.due_date,
    notes: row.notes,
    status: row.status,
    created_at: row.created_at,
    completed_at: row.completed_at,
    exerciseCount: row.homework_exercises?.[0]?.count ?? 0,
  }));
}

type HomeworkExerciseJoinRow = {
  id: string;
  position: number;
  completed_at: string | null;
  exercises: {
    id: string;
    title: string;
    description: string;
    duration_minutes: number;
  } | null;
};

function mapHomeworkWithExercises(
  homework: Homework,
  items: HomeworkExerciseJoinRow[]
): HomeworkWithExercises {
  return {
    id: homework.id,
    teacher_id: homework.teacher_id,
    student_id: homework.student_id,
    name: homework.name,
    objective: homework.objective,
    due_date: homework.due_date,
    notes: homework.notes,
    status: homework.status,
    created_at: homework.created_at,
    completed_at: homework.completed_at,
    // A constraint de FK (on delete cascade) garante que uma linha de
    // homework_exercises nunca sobrevive à exclusão do exercício
    // referenciado — por isso é seguro tratar "exercises" como presente.
    exercises: items.map((row) => ({
      linkId: row.id,
      position: row.position,
      completedAt: row.completed_at,
      exercise: row.exercises!,
    })),
  };
}

// Busca um homework específico com todos os exercícios (visão do professor).
export async function getHomeworkWithExercises(
  id: string,
  teacherId: string
): Promise<HomeworkWithExercises | null> {
  const supabase = createClient();

  const { data: homework, error } = await supabase
    .from("homeworks")
    .select("*")
    .eq("id", id)
    .eq("teacher_id", teacherId)
    .single();

  if (error || !homework) {
    return null;
  }

  const { data: items } = await supabase
    .from("homework_exercises")
    .select(
      "id, position, completed_at, exercises(id, title, description, duration_minutes)"
    )
    .eq("homework_id", id)
    .order("position", { ascending: true });

  return mapHomeworkWithExercises(homework, items ?? []);
}

// Lista os homeworks pendentes de um aluno (usado no portal do aluno).
export async function getPendingHomeworksForStudent(
  studentId: string
): Promise<Homework[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("homeworks")
    .select("*")
    .eq("student_id", studentId)
    .eq("status", "pending")
    .order("due_date", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return (data as Homework[]) ?? [];
}

// Busca um homework específico com exercícios, escopado ao próprio aluno.
export async function getHomeworkForStudent(
  id: string,
  studentId: string
): Promise<HomeworkWithExercises | null> {
  const supabase = createClient();

  const { data: homework, error } = await supabase
    .from("homeworks")
    .select("*")
    .eq("id", id)
    .eq("student_id", studentId)
    .single();

  if (error || !homework) {
    return null;
  }

  const { data: items } = await supabase
    .from("homework_exercises")
    .select(
      "id, position, completed_at, exercises(id, title, description, duration_minutes)"
    )
    .eq("homework_id", id)
    .order("position", { ascending: true });

  return mapHomeworkWithExercises(homework, items ?? []);
}

export type CompleteExerciseResult = {
  homeworkCompleted: boolean;
  homeworkId: string | null;
};

// Marca um exercício específico (dentro de um homework) como concluído e,
// se for o último exercício pendente, marca o homework inteiro também.
// Retorna se o homework foi concluído nesta chamada (para quem chamar
// decidir se dispara notificação, sem misturar essa responsabilidade
// aqui na camada de dados).
export async function completeHomeworkExercise(
  linkId: string
): Promise<CompleteExerciseResult> {
  const supabase = createClient();

  const { data: link, error: linkError } = await supabase
    .from("homework_exercises")
    .update({ completed_at: new Date().toISOString() })
    .eq("id", linkId)
    .select("homework_id")
    .single();

  if (linkError || !link) {
    console.error(linkError);
    return { homeworkCompleted: false, homeworkId: null };
  }

  const [{ count: total }, { count: completed }] = await Promise.all([
    supabase
      .from("homework_exercises")
      .select("*", { count: "exact", head: true })
      .eq("homework_id", link.homework_id),
    supabase
      .from("homework_exercises")
      .select("*", { count: "exact", head: true })
      .eq("homework_id", link.homework_id)
      .not("completed_at", "is", null),
  ]);

  const allDone =
    total !== null && completed !== null && total > 0 && total === completed;

  if (allDone) {
    await supabase
      .from("homeworks")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", link.homework_id);
  }

  return { homeworkCompleted: allDone, homeworkId: link.homework_id };
}
