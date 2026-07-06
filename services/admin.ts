import { createClient } from "@/lib/supabase/server";
import { countByKey, countRows } from "@/lib/db-helpers";
import type { Profile } from "@/types/profile";

export async function isCurrentUserAdmin(): Promise<{
  isAdmin: boolean;
  userId: string | null;
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isAdmin: false, userId: null };
  }

  const { data } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  return { isAdmin: data?.is_admin === true, userId: user.id };
}

export type AdminOverview = {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  totalHomeworks: number;
  planCounts: { starter: number; pro: number };
};

// Visão geral do produto: contagens globais + distribuição de planos.
// "Homeworks" soma os dois sistemas existentes (aula única e exercícios).
export async function getAdminOverview(): Promise<AdminOverview> {
  const supabase = createClient();

  const [
    totalUsers,
    totalTeachers,
    totalStudents,
    totalAssignments,
    totalHomeworksCount,
    { data: subscriptions },
  ] = await Promise.all([
    countRows("profiles", (query) => query),
    countRows("profiles", (query) => query.eq("role", "teacher")),
    countRows("profiles", (query) => query.eq("role", "student")),
    countRows("assignments", (query) => query),
    countRows("homeworks", (query) => query),
    supabase.from("subscriptions").select("plan_slug"),
  ]);

  const planCounts = { starter: 0, pro: 0 };
  for (const row of subscriptions ?? []) {
    if (row.plan_slug === "starter") planCounts.starter += 1;
    if (row.plan_slug === "pro") planCounts.pro += 1;
  }

  return {
    totalUsers,
    totalTeachers,
    totalStudents,
    totalHomeworks: totalAssignments + totalHomeworksCount,
    planCounts,
  };
}

export type TeacherOverviewRow = {
  id: string;
  name: string | null;
  email: string;
  planName: "Starter" | "Pro";
  studentsCount: number;
  homeworksCount: number;
  createdAt: string;
};

// Tabela de professores com plano e contagens (alunos, homeworks) — junta
// várias das métricas pedidas em uma única visão por professor.
export async function getTeachersOverview(): Promise<TeacherOverviewRow[]> {
  const supabase = createClient();

  const { data: teachers, error } = await supabase
    .from("profiles")
    .select("id, name, email, created_at")
    .eq("role", "teacher")
    .order("created_at", { ascending: false });

  if (error || !teachers || teachers.length === 0) {
    if (error) console.error(error);
    return [];
  }

  const teacherIds = teachers.map((teacher) => teacher.id);

  const [{ data: subs }, { data: students }, { data: assignments }, { data: homeworks }] =
    await Promise.all([
      supabase
        .from("subscriptions")
        .select("teacher_id, plan_slug")
        .in("teacher_id", teacherIds),
      supabase.from("students").select("teacher_id").in("teacher_id", teacherIds),
      supabase
        .from("assignments")
        .select("teacher_id")
        .in("teacher_id", teacherIds),
      supabase
        .from("homeworks")
        .select("teacher_id")
        .in("teacher_id", teacherIds),
    ]);

  const planByTeacher = new Map(
    (subs ?? []).map((sub) => [sub.teacher_id, sub.plan_slug])
  );
  const studentCounts = countByKey(students ?? [], "teacher_id");
  const assignmentCounts = countByKey(assignments ?? [], "teacher_id");
  const homeworkCounts = countByKey(homeworks ?? [], "teacher_id");

  return teachers.map((teacher) => ({
    id: teacher.id,
    name: teacher.name,
    email: teacher.email,
    planName: planByTeacher.get(teacher.id) === "pro" ? "Pro" : "Starter",
    studentsCount: studentCounts[teacher.id] ?? 0,
    homeworksCount:
      (assignmentCounts[teacher.id] ?? 0) + (homeworkCounts[teacher.id] ?? 0),
    createdAt: teacher.created_at,
  }));
}

// Lista de todos os usuários (professores e alunos).
export async function getAllUsers(): Promise<Profile[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data as Profile[]) ?? [];
}

export type LogRow = {
  id: string;
  event_type: string;
  actor_id: string | null;
  actor_email: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export async function getRecentLogs(limit = 50): Promise<LogRow[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("admin_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(error);
    return [];
  }

  return (data as LogRow[]) ?? [];
}
