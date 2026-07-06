import Link from "next/link";
import { notFound } from "next/navigation";
import { getStudentById } from "@/services/students";
import { getExercises } from "@/services/exercises";
import { HomeworkForm } from "@/components/students/HomeworkForm";
import { getCurrentUser } from "@/lib/auth-guard";

export default async function NewHomeworkPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  const student = await getStudentById(params.id, user.id);

  if (!student) {
    notFound();
  }

  // Busca todos os exercícios (30 no total) para o seletor, sem paginação.
  const { exercises } = await getExercises({ pageSize: 100 });

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Link
        href={`/students/${student.id}`}
        className="w-fit text-sm text-gray-500 hover:text-black"
      >
        ← Voltar para {student.name}
      </Link>

      <div>
        <h1 className="text-2xl font-semibold">Novo Homework</h1>
        <p className="text-sm text-gray-500">
          Monte um homework personalizado para {student.name} com exercícios
          da biblioteca.
        </p>
      </div>

      <HomeworkForm studentId={student.id} exercises={exercises} />
    </div>
  );
}
