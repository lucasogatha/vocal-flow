"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireTeacher } from "@/lib/auth-guard";
import { homeworkSchema } from "@/validations/homework.schema";
import { insertHomework } from "@/services/homeworks";
import { getStudentById } from "@/services/students";
import { sendHomeworkReceivedEmail } from "@/services/notifications";
import { logEvent } from "@/services/logs";

export type CreateHomeworkState = {
  errors?: Partial<Record<"name" | "dueDate" | "exerciseIds", string>>;
  message?: string;
};

export async function createHomeworkAction(
  studentId: string,
  _prevState: CreateHomeworkState,
  formData: FormData
): Promise<CreateHomeworkState> {
  const auth = await requireTeacher();
  if (!auth.ok) {
    return { message: auth.message };
  }

  const student = await getStudentById(studentId, auth.userId);
  if (!student) {
    return { message: "Aluno não encontrado." };
  }

  const parsed = homeworkSchema.safeParse({
    name: formData.get("name"),
    objective: formData.get("objective"),
    dueDate: formData.get("dueDate"),
    notes: formData.get("notes"),
    exerciseIds: formData.getAll("exerciseIds"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      errors: {
        name: fieldErrors.name?.[0],
        dueDate: fieldErrors.dueDate?.[0],
        exerciseIds: fieldErrors.exerciseIds?.[0],
      },
    };
  }

  const { error } = await insertHomework({
    teacherId: auth.userId,
    studentId,
    name: parsed.data.name,
    objective: parsed.data.objective ? parsed.data.objective : null,
    dueDate: parsed.data.dueDate,
    notes: parsed.data.notes ? parsed.data.notes : null,
    exerciseIds: parsed.data.exerciseIds,
  });

  if (error) {
    return {
      message: "Não foi possível criar o homework. Tente novamente.",
    };
  }

  await sendHomeworkReceivedEmail({
    to: student.email,
    studentName: student.name,
    homeworkTitle: parsed.data.name,
    dueDateLabel: new Date(
      parsed.data.dueDate + "T00:00:00"
    ).toLocaleDateString("pt-BR"),
  });

  await logEvent(
    "homework_created",
    { id: auth.userId },
    { type: "exercises", studentId, exerciseCount: parsed.data.exerciseIds.length }
  );

  revalidatePath(`/students/${studentId}`);
  redirect(
    `/students/${studentId}?toast=${encodeURIComponent(
      "Homework criado com sucesso."
    )}`
  );
}
