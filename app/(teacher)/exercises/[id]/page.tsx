import Link from "next/link";
import { notFound } from "next/navigation";
import { getExerciseById, countHomeworksUsingExercise } from "@/services/exercises";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CATEGORY_STYLES } from "@/lib/exercise-categories";
import { DeleteExerciseButton } from "@/components/exercises/DeleteExerciseButton";

export default async function ExerciseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const exercise = await getExerciseById(params.id);

  if (!exercise) {
    notFound();
  }

  const usageCount = await countHomeworksUsingExercise(exercise.id);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/exercises"
        className="w-fit text-sm text-muted-foreground hover:text-foreground"
      >
        ← Volver a la Biblioteca de Ejercicios
      </Link>

      <Card className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium",
                CATEGORY_STYLES[exercise.category]
              )}
            >
              {exercise.category}
            </span>
            <span className="text-xs text-muted-foreground">{exercise.level}</span>
            <span className="text-xs text-muted-foreground">
              {exercise.duration_minutes} min
            </span>
          </div>
          <DeleteExerciseButton
            exerciseId={exercise.id}
            exerciseTitle={exercise.title}
            usageCount={usageCount}
          />
        </div>
        <h1 className="text-2xl font-semibold">{exercise.title}</h1>
        <p className="text-sm text-muted-foreground">{exercise.objective}</p>
      </Card>

      <Card className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Descripción</h2>
        <p className="whitespace-pre-line text-sm text-muted-foreground">
          {exercise.description}
        </p>
      </Card>

      <Card className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {exercise.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
