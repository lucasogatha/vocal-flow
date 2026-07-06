import { createClient } from "@/lib/supabase/server";
import { countRows } from "@/lib/db-helpers";
import { logEvent } from "@/services/logs";
import type { Student } from "@/types/student";

type GetStudentsParams = {
  teacherId: string;
  search?: string;
  page?: number;
  pageSize?: number;
};

type GetStudentsResult = {
  students: Student[];
  totalCount: number;
};

// Lista (com busca e paginação) os alunos vinculados a um professor.
export async function getStudentsByTeacher({
  teacherId,
  search,
  page = 1,
  pageSize = 9,
}: GetStudentsParams): Promise<GetStudentsResult> {
  const supabase = createClient();

  let query = supabase
    .from("students")
    .select("*", { count: "exact" })
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error(error);
    return { students: [], totalCount: 0 };
  }

  return { students: (data as Student[]) ?? [], totalCount: count ?? 0 };
}

// Conta os alunos de um professor (usado no dashboard).
export async function countStudentsByTeacher(
  teacherId: string
): Promise<number> {
  return countRows("students", (query) => query.eq("teacher_id", teacherId));
}

// Conta os alunos de um professor que nunca receberam nenhum homework.
export async function countStudentsWithoutHomeworks(
  teacherId: string
): Promise<number> {
  const supabase = createClient();

  const { data: allStudents, error: studentsError } = await supabase
    .from("students")
    .select("id")
    .eq("teacher_id", teacherId);

  if (studentsError || !allStudents) {
    console.error(studentsError);
    return 0;
  }

  if (allStudents.length === 0) {
    return 0;
  }

  const { data: assignedRows, error: homeworksError } = await supabase
    .from("homeworks")
    .select("student_id")
    .eq("teacher_id", teacherId);

  if (homeworksError) {
    console.error(homeworksError);
    return allStudents.length;
  }

  const studentIdsWithHomework = new Set(
    (assignedRows ?? []).map((row) => row.student_id)
  );

  return allStudents.filter((student) => !studentIdsWithHomework.has(student.id))
    .length;
}

// Busca um aluno específico, garantindo que pertence ao professor logado.
export async function getStudentById(
  id: string,
  teacherId: string
): Promise<Student | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .eq("teacher_id", teacherId)
    .single();

  if (error) {
    return null;
  }

  return data as Student;
}

// Garante que o usuário logado (aluno) esteja vinculado a um registro de
// students. Se ainda não estiver, tenta vincular pelo e-mail (o registro
// precisa ter sido criado antes por um professor). Retorna null se nenhum
// registro correspondente for encontrado.
export async function ensureStudentLink(
  userId: string,
  email: string
): Promise<Student | null> {
  const supabase = createClient();
  const normalizedEmail = email.trim().toLowerCase();

  const { data: linked, error: linkedError } = await supabase
    .from("students")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (linkedError) {
    console.error(linkedError);
  }

  if (linked) {
    return linked as Student;
  }

  // Pode haver mais de um registro não vinculado com o mesmo e-mail (dois
  // professores cadastrando o mesmo aluno antes dele ativar a conta) — por
  // isso buscamos uma lista (ordenada, mais antigo primeiro) em vez de usar
  // maybeSingle(), que falharia com múltiplas linhas.
  const { data: unclaimedRows, error: unclaimedError } = await supabase
    .from("students")
    .select("*")
    .ilike("email", normalizedEmail)
    .is("user_id", null)
    .order("created_at", { ascending: true })
    .limit(1);

  if (unclaimedError) {
    console.error(unclaimedError);
    return null;
  }

  const unclaimed = unclaimedRows?.[0];

  if (!unclaimed) {
    return null;
  }

  const { data: claimed, error } = await supabase
    .from("students")
    .update({ user_id: userId })
    .eq("id", unclaimed.id)
    .select()
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  await logEvent(
    "student_account_claimed",
    { id: userId, email: normalizedEmail },
    { studentId: unclaimed.id }
  );

  return claimed as Student;
}

// Registra o momento em que o aluno acessou o portal.
export async function touchStudentLastSeen(studentId: string): Promise<void> {
  const supabase = createClient();

  await supabase
    .from("students")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", studentId);
}

// Insere um novo aluno vinculado ao professor logado.
export async function insertStudent(input: {
  teacherId: string;
  name: string;
  email: string;
  phone: string | null;
}) {
  const supabase = createClient();

  return supabase.from("students").insert({
    teacher_id: input.teacherId,
    name: input.name,
    email: input.email,
    phone: input.phone,
  });
}
