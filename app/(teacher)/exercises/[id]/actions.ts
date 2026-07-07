"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireTeacher } from "@/lib/auth-guard";
import { createClient } from "@/lib/supabase/server";
import { logEvent } from "@/services/logs";

export async function deleteExerciseAction(exerciseId: string) {
  const auth = await requireTeacher();
  if (!auth.ok) {
    return;
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("exercises")
    .delete()
    .eq("id", exerciseId);

  if (error) {
    console.error(error);
    return;
  }

  // homework_exercises que referenciavam este exercício são removidos
  // automaticamente pelo banco (ON DELETE CASCADE) — inclusive em
  // homeworks de outros professores, já que a Biblioteca é compartilhada.
  await logEvent(
    "exercise_deleted",
    { id: auth.userId },
    { exerciseId }
  );

  revalidatePath("/exercises");
  redirect(
    `/exercises?toast=${encodeURIComponent("Ejercicio eliminado.")}`
  );
}
