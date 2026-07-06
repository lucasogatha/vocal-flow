"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth-guard";
import { completeHomeworkExercise } from "@/services/homeworks";
import { getProfileById } from "@/services/profiles";
import { sendHomeworkCompletedEmail } from "@/services/notifications";
import { logEvent } from "@/services/logs";

type CompletedHomeworkRow = {
  name: string;
  teacher_id: string;
  students: { name: string } | null;
};

export async function completeHomeworkExerciseAction(linkId: string) {
  const auth = await requireUser();
  if (!auth.ok) {
    return;
  }

  // A RLS garante que só é possível atualizar exercícios dos próprios
  // homeworks do aluno.
  const result = await completeHomeworkExercise(linkId);

  revalidatePath("/student-portal", "layout");

  // Só notifica o professor quando o ÚLTIMO exercício do homework é
  // concluído (ou seja, o homework inteiro virou "completed") — não a
  // cada exercício individual.
  if (result.homeworkCompleted && result.homeworkId) {
    await logEvent(
      "homework_completed",
      { id: auth.userId },
      { type: "exercises", homeworkId: result.homeworkId }
    );

    const supabase = createClient();
    const { data: homework } = await supabase
      .from("homeworks")
      .select("name, teacher_id, students(name)")
      .eq("id", result.homeworkId)
      .single();

    if (homework) {
      const row = homework as unknown as CompletedHomeworkRow;
      const teacherProfile = await getProfileById(row.teacher_id);

      if (teacherProfile) {
        await sendHomeworkCompletedEmail({
          to: teacherProfile.email,
          teacherName: teacherProfile.name ?? "Professor",
          studentName: row.students?.name ?? "Um aluno",
          homeworkTitle: row.name,
        });
      }
    }
  }
}
