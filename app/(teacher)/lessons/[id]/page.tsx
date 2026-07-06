import Link from "next/link";
import { notFound } from "next/navigation";
import { getLessonById } from "@/services/lessons";
import { Card } from "@/components/ui/card";

export default async function LessonDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const lesson = await getLessonById(params.id);

  if (!lesson) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/lessons"
        className="w-fit text-sm text-gray-500 hover:text-black"
      >
        ← Voltar para a Biblioteca
      </Link>

      <Card className="flex flex-col gap-2">
        <span className="text-xs font-medium text-gray-400">
          Aula {lesson.order_index}
        </span>
        <h1 className="text-2xl font-semibold">{lesson.title}</h1>
        <p className="text-sm text-gray-500">{lesson.description}</p>
      </Card>

      <Card className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Objetivo</h2>
        <p className="text-sm text-gray-500">{lesson.objective}</p>
      </Card>

      <Card className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Exercícios</h2>
        {lesson.exercises.length === 0 ? (
          <p className="text-sm text-gray-500">
            Nenhum exercício cadastrado.
          </p>
        ) : (
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
            {lesson.exercises.map((exercise, index) => (
              <li key={index}>{exercise}</li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Homework</h2>
        <p className="text-sm text-gray-500">{lesson.homework}</p>
      </Card>
    </div>
  );
}
