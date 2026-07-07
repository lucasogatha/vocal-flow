"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireTeacher } from "@/lib/auth-guard";
import { exerciseSchema } from "@/validations/exercise.schema";
import { insertExercise } from "@/services/exercises";
import type { ExerciseCategory, ExerciseLevel } from "@/types/exercise";

export type CreateExerciseState = {
  errors?: Partial<
    Record<
      | "title"
      | "category"
      | "objective"
      | "description"
      | "duration_minutes"
      | "level",
      string
    >
  >;
  message?: string;
};

export async function createExerciseAction(
  _prevState: CreateExerciseState,
  formData: FormData
): Promise<CreateExerciseState> {
  const auth = await requireTeacher();
  if (!auth.ok) {
    return { message: auth.message };
  }

  const parsed = exerciseSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    objective: formData.get("objective"),
    description: formData.get("description"),
    duration_minutes: formData.get("duration_minutes"),
    level: formData.get("level"),
    tags: formData.get("tags"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      errors: {
        title: fieldErrors.title?.[0],
        category: fieldErrors.category?.[0],
        objective: fieldErrors.objective?.[0],
        description: fieldErrors.description?.[0],
        duration_minutes: fieldErrors.duration_minutes?.[0],
        level: fieldErrors.level?.[0],
      },
    };
  }

  const tags = parsed.data.tags
    ? parsed.data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  const { error } = await insertExercise({
    teacherId: auth.userId,
    title: parsed.data.title,
    category: parsed.data.category as ExerciseCategory,
    objective: parsed.data.objective,
    description: parsed.data.description,
    duration_minutes: parsed.data.duration_minutes as 5 | 10 | 15,
    level: parsed.data.level as ExerciseLevel,
    tags,
  });

  if (error) {
    return {
      message:
        "No fue posible crear el ejercicio. Es posible que ya exista uno con este título.",
    };
  }

  revalidatePath("/exercises");
  redirect(
    `/exercises?toast=${encodeURIComponent("Ejercicio creado con éxito.")}`
  );
}
