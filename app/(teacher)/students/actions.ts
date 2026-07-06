"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireTeacher } from "@/lib/auth-guard";
import { studentSchema } from "@/validations/student.schema";
import { insertStudent } from "@/services/students";
import { getStudentLimitStatus } from "@/services/subscriptions";
import { logEvent } from "@/services/logs";

export type CreateStudentState = {
  errors?: Partial<Record<"name" | "email" | "phone", string>>;
  message?: string;
  limitReached?: boolean;
  planLimit?: number;
};

export async function createStudentAction(
  _prevState: CreateStudentState,
  formData: FormData
): Promise<CreateStudentState> {
  const auth = await requireTeacher();
  if (!auth.ok) {
    return { message: auth.message };
  }

  // Bloqueia o cadastro antes de validar o formulário: não faz sentido
  // mostrar erros de campo se o professor nem pode cadastrar mais alunos.
  const limitStatus = await getStudentLimitStatus(auth.userId);
  if (!limitStatus.canAddMore) {
    await logEvent(
      "plan_limit_reached",
      { id: auth.userId },
      { limit: limitStatus.limit, currentCount: limitStatus.currentCount }
    );

    return {
      limitReached: true,
      planLimit: limitStatus.limit ?? undefined,
    };
  }

  const parsed = studentSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      errors: {
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        phone: fieldErrors.phone?.[0],
      },
    };
  }

  const { error } = await insertStudent({
    teacherId: auth.userId,
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ? parsed.data.phone : null,
  });

  if (error) {
    return {
      message: "No fue posible registrar al alumno. Intenta de nuevo.",
    };
  }

  revalidatePath("/students");
  redirect(
    `/students?toast=${encodeURIComponent(
      `${parsed.data.name} fue registrado con éxito.`
    )}`
  );
}
