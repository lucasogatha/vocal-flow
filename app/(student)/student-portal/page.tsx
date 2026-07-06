import Link from "next/link";
import { ensureStudentLink, touchStudentLastSeen } from "@/services/students";
import {
  getNextAssignmentForStudent,
  getAssignmentHistoryForStudent,
} from "@/services/assignments";
import { getPendingHomeworksForStudent } from "@/services/homeworks";
import { STATUS_LABEL } from "@/lib/assignment-status";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { CompleteHomeworkButton } from "@/components/students/CompleteHomeworkButton";
import { getCurrentUser } from "@/lib/auth-guard";

export default async function StudentPortalPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const student = await ensureStudentLink(user.id, user.email ?? "");

  if (!student) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Conta ainda não vinculada</h1>
        <p className="text-sm text-gray-500">
          Não encontramos nenhum professor que tenha cadastrado o e-mail{" "}
          <span className="font-medium">{user.email}</span>. Peça para o seu
          professor te cadastrar com esse mesmo e-mail no VocalFlow.
        </p>
      </div>
    );
  }

  const nextAssignment = await getNextAssignmentForStudent(student.id);
  const history = await getAssignmentHistoryForStudent(student.id);
  const pendingHomeworks = await getPendingHomeworksForStudent(student.id);

  // Registra o acesso. É aguardado para garantir que a gravação realmente
  // seja concluída antes da resposta terminar (ambientes serverless podem
  // interromper promises não aguardadas).
  await touchStudentLastSeen(student.id);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold">Olá, {student.name}</h1>
        <p className="text-sm text-gray-500">Seu treino da semana.</p>
      </div>

      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Próximo Homework</h2>

        {!nextAssignment || !nextAssignment.lesson ? (
          <p className="text-sm text-gray-500">
            Nenhum homework pendente no momento.
          </p>
        ) : (
          <>
            <div>
              <p className="font-medium">{nextAssignment.lesson.title}</p>
              <p className="text-sm text-gray-500">
                Data limite:{" "}
                {new Date(
                  nextAssignment.due_date + "T00:00:00"
                ).toLocaleDateString("pt-BR")}
              </p>
              <p className="text-sm text-gray-500">
                Status: {STATUS_LABEL[nextAssignment.status] ?? nextAssignment.status}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700">Objetivo</p>
              <p className="text-sm text-gray-500">
                {nextAssignment.lesson.objective}
              </p>
            </div>

            {nextAssignment.teacher_notes && (
              <div className="rounded-md bg-gray-50 p-3">
                <p className="text-sm font-medium text-gray-700">
                  Observação do professor
                </p>
                <p className="text-sm text-gray-500">
                  {nextAssignment.teacher_notes}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-700">Exercícios</p>
              {nextAssignment.lesson.exercises.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Nenhum exercício cadastrado.
                </p>
              ) : (
                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                  {nextAssignment.lesson.exercises.map((exercise, index) => (
                    <li key={index}>{exercise}</li>
                  ))}
                </ul>
              )}
            </div>

            <CompleteHomeworkButton assignmentId={nextAssignment.id} />
          </>
        )}
      </Card>

      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Meus Homeworks</h2>

        {pendingHomeworks.length === 0 ? (
          <p className="text-sm text-gray-500">
            Nenhum homework pendente no momento.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {pendingHomeworks.map((homework) => (
              <li
                key={homework.id}
                className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{homework.name}</span>
                  <span className="text-gray-500">
                    Prazo:{" "}
                    {new Date(
                      homework.due_date + "T00:00:00"
                    ).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <Link
                  href={`/student-portal/homework/${homework.id}`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Abrir
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Histórico</h2>

        {history.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum homework ainda.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {history.map((assignment) => (
              <li
                key={assignment.id}
                className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm"
              >
                <span>{assignment.lesson_title}</span>
                <span className="text-xs text-gray-500">
                  {assignment.status === "completed" && assignment.completed_at
                    ? `Concluído em ${new Date(
                        assignment.completed_at
                      ).toLocaleDateString("pt-BR")}`
                    : STATUS_LABEL[assignment.status] ?? assignment.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
