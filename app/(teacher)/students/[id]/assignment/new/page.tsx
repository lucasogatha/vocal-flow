import Link from "next/link";
import { notFound } from "next/navigation";
import { getStudentById } from "@/services/students";
import { getLessons } from "@/services/lessons";
import { AssignmentForm } from "@/components/students/AssignmentForm";
import { getCurrentUser } from "@/lib/auth-guard";

export default async function NewAssignmentPage({
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

  // Busca todas as aulas para o seletor (a biblioteca terá no máximo
  // 100 aulas, então cabe tranquilamente sem paginação aqui).
  const { lessons } = await getLessons({ sort: "order", pageSize: 200 });

  return (
    <div className="flex max-w-md flex-col gap-6">
      <Link
        href={`/students/${student.id}`}
        className="w-fit text-sm text-gray-500 hover:text-black"
      >
        ← Voltar para {student.name}
      </Link>

      <div>
        <h1 className="text-2xl font-semibold">Enviar Homework</h1>
        <p className="text-sm text-gray-500">
          Escolha uma aula e defina uma data limite para {student.name}.
        </p>
      </div>

      <AssignmentForm studentId={student.id} lessons={lessons} />
    </div>
  );
}
