"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireTeacher } from "@/lib/auth-guard";
import { assignmentSchema } from "@/validations/assignment.schema";
import { insertAssignment } from "@/services/assignments";
import { getStudentById } from "@/services/students";
import { getLessonById } from "@/services/lessons";
import { sendHomeworkReceivedEmail } from "@/services/notifications";
import { logEvent } from "@/services/logs";

export type CreateAssignmentState = {
  errors?: Partial<Record<"lessonId" | "dueDate", string>>;
  message?: string;
};

export async function createAssignmentAction(
  studentId: string,
  _prevState: CreateAssignmentState,
  formData: FormData
): Promise<CreateAssignmentState> {
  const auth = await requireTeacher();
  if (!auth.ok) {
    return { message: auth.message };
  }

  // Garante que o aluno pertence ao professor logado.
  const student = await getStudentById(studentId, auth.userId);
  if (!student) {
    return { message: "Aluno não encontrado." };
  }

  const parsed = assignmentSchema.safeParse({
    lessonId: formData.get("lessonId"),
    dueDate: formData.get("dueDate"),
    teacherNotes: formData.get("teacherNotes"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      errors: {
        lessonId: fieldErrors.lessonId?.[0],
        dueDate: fieldErrors.dueDate?.[0],
      },
    };
  }

  const { error } = await insertAssignment({
    teacherId: auth.userId,
    studentId,
    lessonId: parsed.data.lessonId,
    dueDate: parsed.data.dueDate,
    teacherNotes: parsed.data.teacherNotes ? parsed.data.teacherNotes : null,
  });

  if (error) {
    return {
      message: "Não foi possível enviar o homework. Tente novamente.",
    };
  }

  // Notifica o aluno por e-mail. Nunca bloqueia o fluxo em caso de falha
  // (ver services/notifications.ts).
  const lesson = await getLessonById(parsed.data.lessonId);
  await sendHomeworkReceivedEmail({
    to: student.email,
    studentName: student.name,
    homeworkTitle: lesson?.title ?? "Nova aula",
    dueDateLabel: new Date(
      parsed.data.dueDate + "T00:00:00"
    ).toLocaleDateString("pt-BR"),
  });

  await logEvent(
    "homework_created",
    { id: auth.userId },
    { type: "lesson", studentId, lessonId: parsed.data.lessonId }
  );

  revalidatePath(`/students/${studentId}`);
  redirect(
    `/students/${studentId}?toast=${encodeURIComponent(
      "Homework enviado com sucesso."
    )}`
  );
}
