"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth-guard";
import { getProfileById } from "@/services/profiles";
import { sendHomeworkCompletedEmail } from "@/services/notifications";
import { logEvent } from "@/services/logs";

// Shape explícito do retorno do join, para não precisar de "as any" ao
// acessar os campos relacionados.
type CompletedAssignmentRow = {
  teacher_id: string;
  students: { name: string } | null;
  lessons: { title: string } | null;
};

export async function completeAssignmentAction(assignmentId: string) {
  const auth = await requireUser();
  if (!auth.ok) {
    return;
  }

  const supabase = createClient();

  // A RLS garante que só é possível atualizar homeworks do próprio aluno.
  const { data: updated, error } = await supabase
    .from("assignments")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", assignmentId)
    .select("teacher_id, students(name), lessons(title)")
    .single();

  if (error || !updated) {
    console.error(error);
    return;
  }

  const row = updated as unknown as CompletedAssignmentRow;

  revalidatePath("/student-portal");

  await logEvent(
    "homework_completed",
    { id: auth.userId },
    { type: "lesson", assignmentId }
  );

  // Notifica o professor por e-mail. Nunca bloqueia o fluxo em caso de
  // falha (ver services/notifications.ts).
  const teacherProfile = await getProfileById(row.teacher_id);
  if (teacherProfile) {
    await sendHomeworkCompletedEmail({
      to: teacherProfile.email,
      teacherName: teacherProfile.name ?? "Professor",
      studentName: row.students?.name ?? "Um aluno",
      homeworkTitle: row.lessons?.title ?? "Homework",
    });
  }
}
