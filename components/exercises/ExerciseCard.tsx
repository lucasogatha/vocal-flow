import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CATEGORY_STYLES } from "@/lib/exercise-categories";
import type { Exercise } from "@/types/exercise";

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium",
            CATEGORY_STYLES[exercise.category]
          )}
        >
          {exercise.category}
        </span>
        <span className="text-xs text-gray-400">
          {exercise.duration_minutes} min
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="font-medium text-gray-900">{exercise.title}</span>
        <p className="line-clamp-2 text-sm text-gray-500">
          {exercise.objective}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{exercise.level}</span>
        <Link
          href={`/exercises/${exercise.id}`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Ver exercício
        </Link>
      </div>
    </Card>
  );
}
