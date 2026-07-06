import Link from "next/link";
import { notFound } from "next/navigation";
import { getExerciseById } from "@/services/exercises";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CATEGORY_STYLES } from "@/lib/exercise-categories";

export default async function ExerciseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const exercise = await getExerciseById(params.id);

  if (!exercise) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/exercises"
        className="w-fit text-sm text-gray-500 hover:text-black"
      >
        ← Voltar para a Biblioteca de Exercícios
      </Link>

      <Card className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium",
              CATEGORY_STYLES[exercise.category]
            )}
          >
            {exercise.category}
          </span>
          <span className="text-xs text-gray-400">{exercise.level}</span>
          <span className="text-xs text-gray-400">
            {exercise.duration_minutes} min
          </span>
        </div>
        <h1 className="text-2xl font-semibold">{exercise.title}</h1>
        <p className="text-sm text-gray-500">{exercise.objective}</p>
      </Card>

      <Card className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Descrição</h2>
        <p className="whitespace-pre-line text-sm text-gray-600">
          {exercise.description}
        </p>
      </Card>

      <Card className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {exercise.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
