import Link from "next/link";
import { notFound } from "next/navigation";
import { Send, CheckCircle2, AlertTriangle, ClipboardList } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { getStudentById } from "@/services/students";
import { getHomeworksByStudent, getProgressForStudent } from "@/services/homeworks";
import { getHomeworkCounts } from "@/lib/homework-status";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { Progress } from "@/components/ui/progress";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth-guard";

export default async function StudentDetailPage({
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

  const [homeworks, progress] = await Promise.all([
    getHomeworksByStudent(student.id, user.id),
    getProgressForStudent(student.id, user.id),
  ]);

  const counts = getHomeworkCounts(homeworks);

  const memberSince = new Date(student.created_at).toLocaleDateString(
    "es-419"
  );
  const lastSeenLabel = student.last_seen_at
    ? new Date(student.last_seen_at).toLocaleDateString("es-419", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Nunca ingresó";

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/students"
        className="w-fit text-sm text-gray-500 hover:text-black"
      >
        ← Volver a Mis Alumnos
      </Link>

      <Card className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{student.name}</h1>
        <p className="text-sm text-gray-500">{student.email}</p>
        {student.phone && (
          <p className="text-sm text-gray-500">{student.phone}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-400">
          <span>Alumno desde {memberSince}</span>
          <span>Último acceso: {lastSeenLabel}</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Enviados" value={counts.sent} icon={Send} />
        <StatCard
          label="Completados"
          value={counts.completed}
          icon={CheckCircle2}
        />
        <StatCard
          label="Vencidos"
          value={counts.overdue}
          icon={AlertTriangle}
        />
      </div>

      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Progreso</h2>
        <Progress value={progress.percentage} />
        <p className="text-sm text-gray-500">
          {progress.total === 0
            ? "Ningún homework enviado todavía."
            : `${progress.completed} de ${progress.total} homeworks completados (${progress.percentage}%)`}
        </p>
      </Card>

      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Homeworks</h2>
          <Link
            href={`/students/${student.id}/homework/new`}
            className={buttonVariants()}
          >
            Enviar Homework
          </Link>
        </div>

        {homeworks.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Ningún homework enviado todavía."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {homeworks.map((homework) => (
              <li
                key={homework.id}
                className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{homework.name}</span>
                  <span className="text-gray-500">
                    {homework.exerciseCount}{" "}
                    {homework.exerciseCount === 1
                      ? "ejercicio"
                      : "ejercicios"}{" "}
                    · Plazo:{" "}
                    {new Date(
                      homework.due_date + "T00:00:00"
                    ).toLocaleDateString("es-419")}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {homework.status === "completed" ? "Completado" : "Pendiente"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
