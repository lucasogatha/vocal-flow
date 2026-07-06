import Link from "next/link";
import { notFound } from "next/navigation";
import { ensureStudentLink } from "@/services/students";
import { getHomeworkForStudent } from "@/services/homeworks";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CompleteExerciseButton } from "@/components/students/CompleteExerciseButton";
import { getCurrentUser } from "@/lib/auth-guard";

export default async function StudentHomeworkPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  const student = await ensureStudentLink(user.id, user.email ?? "");

  if (!student) {
    notFound();
  }

  const homework = await getHomeworkForStudent(params.id, student.id);

  if (!homework) {
    notFound();
  }

  const total = homework.exercises.length;
  const completed = homework.exercises.filter(
    (item) => item.completedAt
  ).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10">
      <Link
        href="/student-portal"
        className="w-fit text-sm text-gray-500 hover:text-black"
      >
        ← Voltar
      </Link>

      <div>
        <h1 className="text-2xl font-semibold">{homework.name}</h1>
        {homework.objective && (
          <p className="text-sm text-gray-500">{homework.objective}</p>
        )}
      </div>

      <Card className="flex flex-col gap-3">
        <Progress value={percentage} />
        <p className="text-sm text-gray-500">
          {completed} de {total} exercícios concluídos ({percentage}%)
        </p>
        {homework.status === "completed" && (
          <p className="text-sm font-medium text-green-700">
            Homework concluído! 🎉
          </p>
        )}
      </Card>

      <div className="flex flex-col gap-3">
        {homework.exercises.map((item) => (
          <Card key={item.linkId} className="flex flex-col gap-2">
            <span className="font-medium">{item.exercise.title}</span>
            <p className="text-sm text-gray-500">
              {item.exercise.description}
            </p>
            <span className="text-xs text-gray-400">
              {item.exercise.duration_minutes} min
            </span>

            {item.completedAt ? (
              <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                  ✓
                </span>
                Concluído
              </div>
            ) : (
              <CompleteExerciseButton linkId={item.linkId} />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
