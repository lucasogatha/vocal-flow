"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireTeacher } from "@/lib/auth-guard";
import { createClient } from "@/lib/supabase/server";
import { getStudentById } from "@/services/students";
import { logEvent } from "@/services/logs";

export async function deleteStudentAction(studentId: string) {
  const auth = await requireTeacher();
  if (!auth.ok) {
    return;
  }

  // Garante que o aluno pertence ao professor logado antes de excluir.
  const student = await getStudentById(studentId, auth.userId);
  if (!student) {
    return;
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("students")
    .delete()
    .eq("id", studentId)
    .eq("teacher_id", auth.userId);

  if (error) {
    console.error(error);
    return;
  }

  // Homeworks e assignments do aluno são removidos automaticamente pelo
  // banco (ON DELETE CASCADE nas foreign keys).
  await logEvent(
    "student_deleted",
    { id: auth.userId },
    { studentId, studentName: student.name }
  );

  revalidatePath("/students");
  redirect(
    `/students?toast=${encodeURIComponent(
      `${student.name} fue eliminado.`
    )}`
  );
}
