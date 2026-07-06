import Link from "next/link";
import { notFound } from "next/navigation";
import { Send, CheckCircle2, AlertTriangle, ClipboardList } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { getStudentById } from "@/services/students";
import {
  getAssignmentsByStudent,
  getProgressForStudent,
} from "@/services/assignments";
import { buildTimelineEvents, getAssignmentCounts } from "@/lib/assignment-status";
import { getHomeworksByStudent } from "@/services/homeworks";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { Progress } from "@/components/ui/progress";
import { buttonVariants } from "@/components/ui/button";
import { Timeline } from "@/components/students/Timeline";
import { TimelineFilters } from "@/components/students/TimelineFilters";
import { getCurrentUser } from "@/lib/auth-guard";

export default async function StudentDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { filter?: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  const student = await getStudentById(params.id, user.id);

  if (!student) {
    notFound();
  }

  const [assignments, progress, homeworks] = await Promise.all([
    getAssignmentsByStudent(student.id, user.id),
    getProgressForStudent(student.id, user.id),
    getHomeworksByStudent(student.id, user.id),
  ]);

  const counts = getAssignmentCounts(assignments);
  const allEvents = buildTimelineEvents(assignments);
  const activeFilter = searchParams.filter ?? "all";
  const events =
    activeFilter === "all"
      ? allEvents
      : allEvents.filter((event) => event.type === activeFilter);

  const memberSince = new Date(student.created_at).toLocaleDateString(
    "pt-BR"
  );
  const lastSeenLabel = student.last_seen_at
    ? new Date(student.last_seen_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Nunca acessou";

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/students"
        className="w-fit text-sm text-gray-500 hover:text-black"
      >
        ← Voltar para Meus Alunos
      </Link>

      <Card className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{student.name}</h1>
        <p className="text-sm text-gray-500">{student.email}</p>
        {student.phone && (
          <p className="text-sm text-gray-500">{student.phone}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-400">
          <span>Aluno desde {memberSince}</span>
          <span>Último acesso: {lastSeenLabel}</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Enviados" value={counts.sent} icon={Send} />
        <StatCard
          label="Concluídos"
          value={counts.completed}
          icon={CheckCircle2}
        />
        <StatCard
          label="Atrasados"
          value={counts.overdue}
          icon={AlertTriangle}
        />
      </div>

      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Progresso</h2>
        <Progress value={progress.percentage} />
        <p className="text-sm text-gray-500">
          {progress.total === 0
            ? "Nenhum homework enviado ainda."
            : `${progress.completed} de ${progress.total} homeworks concluídos (${progress.percentage}%)`}
        </p>
      </Card>

      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Homeworks personalizados</h2>
          <Link
            href={`/students/${student.id}/homework/new`}
            className={buttonVariants()}
          >
            Novo Homework
          </Link>
        </div>

        {homeworks.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Nenhum homework personalizado criado ainda."
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
                      ? "exercício"
                      : "exercícios"}{" "}
                    · Prazo:{" "}
                    {new Date(
                      homework.due_date + "T00:00:00"
                    ).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {homework.status === "completed" ? "Concluído" : "Pendente"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Linha do tempo</h2>
          <Link
            href={`/students/${student.id}/assignment/new`}
            className={buttonVariants()}
          >
            Enviar Homework
          </Link>
        </div>

        <TimelineFilters studentId={student.id} active={activeFilter} />

        <Timeline events={events} />
      </Card>
    </div>
  );
}
