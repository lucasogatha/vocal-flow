import Link from "next/link";
import { ExerciseForm } from "@/components/exercises/ExerciseForm";

export default function NewExercisePage() {
  return (
    <div className="flex max-w-xl flex-col gap-6">
      <Link
        href="/exercises"
        className="w-fit text-sm text-muted-foreground hover:text-foreground"
      >
        ← Volver a la Biblioteca de Ejercicios
      </Link>

      <div>
        <h1 className="text-2xl font-semibold">Crear ejercicio</h1>
        <p className="text-sm text-muted-foreground">
          Agrega un nuevo ejercicio a la Biblioteca de Ejercicios.
        </p>
      </div>

      <ExerciseForm />
    </div>
  );
}
