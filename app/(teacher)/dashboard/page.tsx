import Link from "next/link";
import { Users, Send, CheckCircle2, Percent, UserX, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { UpcomingLessons } from "@/components/dashboard/UpcomingLessons";
import { Card } from "@/components/ui/card";
import {
  countStudentsByTeacher,
  countStudentsWithoutAssignments,
} from "@/services/students";
import {
  countAssignmentsByTeacher,
  countCompletedAssignmentsByTeacher,
  countOverdueAssignmentsByTeacher,
  getWeeklyCompletionTrend,
  getUpcomingAssignmentsForTeacher,
} from "@/services/assignments";
import { ensureSubscription } from "@/services/subscriptions";
import { getCurrentUser } from "@/lib/auth-guard";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const name =
    (user?.user_metadata?.name as string | undefined) ?? "Professor";

  let studentsCount = 0;
  let sentCount = 0;
  let completedCount = 0;
  let overdueCount = 0;
  let studentsWithoutActivity = 0;
  let weeklyTrend: Awaited<ReturnType<typeof getWeeklyCompletionTrend>> = [];
  let upcoming: Awaited<ReturnType<typeof getUpcomingAssignmentsForTeacher>> =
    [];
  let subscription: Awaited<ReturnType<typeof ensureSubscription>> = null;

  if (user) {
    [
      studentsCount,
      sentCount,
      completedCount,
      overdueCount,
      studentsWithoutActivity,
      weeklyTrend,
      upcoming,
      subscription,
    ] = await Promise.all([
      countStudentsByTeacher(user.id),
      countAssignmentsByTeacher(user.id),
      countCompletedAssignmentsByTeacher(user.id),
      countOverdueAssignmentsByTeacher(user.id),
      countStudentsWithoutAssignments(user.id),
      getWeeklyCompletionTrend(user.id),
      getUpcomingAssignmentsForTeacher(user.id),
      ensureSubscription(user.id),
    ]);
  }

  const completionRate =
    sentCount === 0 ? 0 : Math.round((completedCount / sentCount) * 100);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Olá, {name}</h1>
        <p className="text-sm text-gray-500">
          Aqui está um resumo do seu estúdio.
        </p>
      </div>

      {subscription && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
          <p className="text-sm text-gray-600">
            Plano{" "}
            <strong className="text-gray-900">
              {subscription.plan.name}
            </strong>{" "}
            ·{" "}
            {subscription.plan.student_limit
              ? `${studentsCount} / ${subscription.plan.student_limit} alunos`
              : `${studentsCount} alunos (ilimitado)`}
          </p>
          {subscription.plan_slug === "starter" && (
            <Link
              href="/pricing"
              className="text-sm font-medium text-accent hover:underline"
            >
              Fazer upgrade
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Alunos" value={studentsCount} icon={Users} />
        <StatCard
          label="Homeworks enviados"
          value={sentCount}
          icon={Send}
        />
        <StatCard
          label="Homeworks concluídos"
          value={completedCount}
          icon={CheckCircle2}
        />
        <StatCard
          label="Taxa de conclusão"
          value={`${completionRate}%`}
          icon={Percent}
        />
        <StatCard
          label="Alunos sem atividade"
          value={studentsWithoutActivity}
          icon={UserX}
        />
        <StatCard
          label="Homeworks atrasados"
          value={overdueCount}
          icon={AlertTriangle}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-900">
            Progresso nos últimos 7 dias
          </h2>
          <ProgressChart data={weeklyTrend} />
        </Card>

        <Card className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-gray-900">
            Próximas aulas
          </h2>
          <UpcomingLessons items={upcoming} />
        </Card>
      </div>
    </div>
  );
}
