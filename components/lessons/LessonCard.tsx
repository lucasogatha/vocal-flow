import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/types/lesson";

export function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <Card className="flex flex-col gap-2">
      <span className="text-xs font-medium text-gray-400">
        Aula {lesson.order_index}
      </span>
      <span className="font-medium">{lesson.title}</span>
      <p className="line-clamp-2 text-sm text-gray-500">
        {lesson.description}
      </p>
      <Link
        href={`/lessons/${lesson.id}`}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "mt-1 w-fit"
        )}
      >
        Ver aula
      </Link>
    </Card>
  );
}
