import { createClient } from "@/lib/supabase/server";
import { countByKey, countRows } from "@/lib/db-helpers";
import type {
  Assignment,
  AssignmentWithLesson,
  AssignmentWithLessonDetails,
} from "@/types/assignment";

// Formato de linha retornado pelo join com "lessons(title)", usado nas
// duas funções abaixo que listam homeworks de aula com o título anexado.
type AssignmentWithLessonRow = Assignment & {
  lessons: { title: string } | null;
};

function mapAssignmentWithLesson(
  row: AssignmentWithLessonRow
): AssignmentWithLesson {
  return {
    id: row.id,
    teacher_id: row.teacher_id,
    student_id: row.student_id,
    lesson_id: row.lesson_id,
    status: row.status,
    due_date: row.due_date,
    assigned_at: row.assigned_at,
    completed_at: row.completed_at,
    teacher_notes: row.teacher_notes,
    lesson_title: row.lessons?.title ?? "Aula removida",
  };
}

// Cria um novo homework (aula atribuída a um aluno).
export async function insertAssignment(input: {
  teacherId: string;
  studentId: string;
  lessonId: string;
  dueDate: string;
  teacherNotes: string | null;
}) {
  const supabase = createClient();

  return supabase.from("assignments").insert({
    teacher_id: input.teacherId,
    student_id: input.studentId,
    lesson_id: input.lessonId,
    due_date: input.dueDate,
    teacher_notes: input.teacherNotes,
  });
}

// Lista o histórico de homeworks de um aluno, já com o título da aula.
export async function getAssignmentsByStudent(
  studentId: string,
  teacherId: string
): Promise<AssignmentWithLesson[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("assignments")
    .select("*, lessons(title)")
    .eq("student_id", studentId)
    .eq("teacher_id", teacherId)
    .order("assigned_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return ((data ?? []) as unknown as AssignmentWithLessonRow[]).map(
    mapAssignmentWithLesson
  );
}

// Busca o próximo homework pendente do aluno (usado no portal do aluno).
export async function getNextAssignmentForStudent(
  studentId: string
): Promise<AssignmentWithLessonDetails | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("assignments")
    .select("*, lesson:lessons(title, objective, exercises, homework, order_index)")
    .eq("student_id", studentId)
    .eq("status", "pending")
    .order("due_date", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as unknown as AssignmentWithLessonDetails;
}

// Lista o histórico completo de homeworks do aluno (usado no portal).
export async function getAssignmentHistoryForStudent(
  studentId: string
): Promise<AssignmentWithLesson[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("assignments")
    .select("*, lessons(title)")
    .eq("student_id", studentId)
    .order("assigned_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return ((data ?? []) as unknown as AssignmentWithLessonRow[]).map(
    mapAssignmentWithLesson
  );
}

// Calcula o progresso de um aluno (homeworks concluídos / total).
export async function getProgressForStudent(
  studentId: string,
  teacherId: string
): Promise<{ total: number; completed: number; percentage: number }> {
  const supabase = createClient();

  const [{ count: total, error: totalError }, { count: completed, error: completedError }] =
    await Promise.all([
      supabase
        .from("assignments")
        .select("*", { count: "exact", head: true })
        .eq("student_id", studentId)
        .eq("teacher_id", teacherId),
      supabase
        .from("assignments")
        .select("*", { count: "exact", head: true })
        .eq("student_id", studentId)
        .eq("teacher_id", teacherId)
        .eq("status", "completed"),
    ]);

  if (totalError || completedError) {
    console.error(totalError ?? completedError);
    return { total: 0, completed: 0, percentage: 0 };
  }

  const totalCount = total ?? 0;
  const completedCount = completed ?? 0;
  const percentage =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return { total: totalCount, completed: completedCount, percentage };
}

// Conta todos os homeworks já enviados por um professor (usado no dashboard).
export async function countAssignmentsByTeacher(
  teacherId: string
): Promise<number> {
  return countRows("assignments", (query) =>
    query.eq("teacher_id", teacherId)
  );
}

// Conta os homeworks concluídos de um professor (usado no dashboard).
export async function countCompletedAssignmentsByTeacher(
  teacherId: string
): Promise<number> {
  return countRows("assignments", (query) =>
    query.eq("teacher_id", teacherId).eq("status", "completed")
  );
}

// Conta os homeworks atrasados (pendentes com prazo vencido) de um professor.
export async function countOverdueAssignmentsByTeacher(
  teacherId: string
): Promise<number> {
  const today = new Date().toISOString().split("T")[0];

  return countRows("assignments", (query) =>
    query.eq("teacher_id", teacherId).eq("status", "pending").lt("due_date", today)
  );
}

// Conta os homeworks pendentes de um professor (usado no dashboard).
export async function countPendingAssignmentsByTeacher(
  teacherId: string
): Promise<number> {
  return countRows("assignments", (query) =>
    query.eq("teacher_id", teacherId).eq("status", "pending")
  );
}

// Conclusões por dia nos últimos 7 dias (usado no gráfico do dashboard).
export async function getWeeklyCompletionTrend(
  teacherId: string
): Promise<{ date: string; label: string; count: number }[]> {
  const supabase = createClient();
  const dayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - 6);

  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(start);
    day.setUTCDate(start.getUTCDate() + i);
    return {
      date: day.toISOString().split("T")[0],
      label: dayLabels[day.getUTCDay()],
      count: 0,
    };
  });

  const { data, error } = await supabase
    .from("assignments")
    .select("completed_at")
    .eq("teacher_id", teacherId)
    .eq("status", "completed")
    .gte("completed_at", start.toISOString());

  if (error) {
    console.error(error);
    return days;
  }

  for (const row of data ?? []) {
    if (!row.completed_at) continue;
    const dateKey = row.completed_at.split("T")[0];
    const match = days.find((day) => day.date === dateKey);
    if (match) match.count += 1;
  }

  return days;
}

// Próximos homeworks pendentes por data limite (usado no dashboard).
export async function getUpcomingAssignmentsForTeacher(
  teacherId: string,
  limit = 5
): Promise<
  { id: string; studentName: string; lessonTitle: string; dueDate: string }[]
> {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("assignments")
    .select("id, due_date, students(name), lessons(title)")
    .eq("teacher_id", teacherId)
    .eq("status", "pending")
    .gte("due_date", today)
    .order("due_date", { ascending: true })
    .limit(limit);

  if (error) {
    console.error(error);
    return [];
  }

  type UpcomingAssignmentRow = {
    id: string;
    due_date: string;
    students: { name: string } | null;
    lessons: { title: string } | null;
  };

  return ((data ?? []) as unknown as UpcomingAssignmentRow[]).map((row) => ({
    id: row.id,
    studentName: row.students?.name ?? "Aluno removido",
    lessonTitle: row.lessons?.title ?? "Aula removida",
    dueDate: row.due_date,
  }));
}

// Conta os homeworks de vários alunos de uma vez (evita N+1 queries ao
// listar Meus Alunos).
export async function countAssignmentsByStudentIds(
  studentIds: string[],
  teacherId: string
): Promise<Record<string, number>> {
  if (studentIds.length === 0) {
    return {};
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("assignments")
    .select("student_id")
    .eq("teacher_id", teacherId)
    .in("student_id", studentIds);

  if (error) {
    console.error(error);
    return {};
  }

  const counts = countByKey(data ?? [], "student_id");
  return counts;
}
