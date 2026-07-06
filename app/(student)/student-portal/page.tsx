import Link from "next/link";
import { ensureStudentLink, touchStudentLastSeen } from "@/services/students";
import {
  getPendingHomeworksForStudent,
  getHomeworkHistoryForStudent,
} from "@/services/homeworks";
import { STATUS_LABEL } from "@/lib/homework-status";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
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
        <h1 className="text-xl font-semibold">Cuenta aún no vinculada</h1>
        <p className="text-sm text-gray-500">
          No encontramos ningún profesor que haya registrado el correo{" "}
          <span className="font-medium">{user.email}</span>. Pídele a tu
          profesor que te registre con este mismo correo en VocalFlow.
        </p>
      </div>
    );
  }

  const [pendingHomeworks, history] = await Promise.all([
    getPendingHomeworksForStudent(student.id),
    getHomeworkHistoryForStudent(student.id),
  ]);

  // Registra o acesso. É aguardado para garantir que a gravação realmente
  // seja concluída antes da resposta terminar (ambientes serverless podem
  // interromper promises não aguardadas).
  await touchStudentLastSeen(student.id);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold">Hola, {student.name}</h1>
        <p className="text-sm text-gray-500">Tu entrenamiento de la semana.</p>
      </div>

      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Mis Homeworks</h2>

        {pendingHomeworks.length === 0 ? (
          <p className="text-sm text-gray-500">
            Ningún homework pendiente por el momento.
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
                    Plazo:{" "}
                    {new Date(
                      homework.due_date + "T00:00:00"
                    ).toLocaleDateString("es-419")}
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
        <h2 className="text-lg font-semibold">Historial</h2>

        {history.length === 0 ? (
          <p className="text-sm text-gray-500">Ningún homework todavía.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {history.map((homework) => (
              <li
                key={homework.id}
                className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm"
              >
                <span>{homework.name}</span>
                <span className="text-xs text-gray-500">
                  {homework.status === "completed" && homework.completed_at
                    ? `Completado el ${new Date(
                        homework.completed_at
                      ).toLocaleDateString("es-419")}`
                    : STATUS_LABEL[homework.status] ?? homework.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
