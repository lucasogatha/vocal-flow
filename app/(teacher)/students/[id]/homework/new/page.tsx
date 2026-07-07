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

  // Busca todos os exercícios da biblioteca DESSE professor (até 100),
  // para o seletor, sem paginação.
  const { exercises } = await getExercises({ teacherId: user.id, pageSize: 100 });

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Link
        href={`/students/${student.id}`}
        className="w-fit text-sm text-muted-foreground hover:text-foreground"
      >
        ← Volver a {student.name}
      </Link>

      <div>
        <h1 className="text-2xl font-semibold">Nuevo Homework</h1>
        <p className="text-sm text-muted-foreground">
          Arma un homework personalizado para {student.name} con ejercicios
          de la biblioteca.
        </p>
      </div>

      <HomeworkForm studentId={student.id} exercises={exercises} />
    </div>
  );
}
