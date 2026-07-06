import Link from "next/link";
import { Users, GraduationCap, BookOpen, ClipboardList } from "lucide-react";
import { getAdminOverview, getRecentLogs } from "@/services/admin";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default async function AdminOverviewPage() {
  const [overview, recentLogs] = await Promise.all([
    getAdminOverview(),
    getRecentLogs(5),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Painel Administrativo</h1>
        <p className="text-sm text-gray-500">
          Visão geral de todo o VocalFlow.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Usuários" value={overview.totalUsers} icon={Users} />
        <StatCard
          label="Professores"
          value={overview.totalTeachers}
          icon={GraduationCap}
        />
        <StatCard
          label="Alunos"
          value={overview.totalStudents}
          icon={BookOpen}
        />
        <StatCard
          label="Homeworks"
          value={overview.totalHomeworks}
          icon={ClipboardList}
        />
      </div>

      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Planos</h2>
        <div className="flex gap-6 text-sm text-gray-600">
          <span>
            Starter:{" "}
            <strong className="text-gray-900">
              {overview.planCounts.starter}
            </strong>
          </span>
          <span>
            Pro:{" "}
            <strong className="text-gray-900">
              {overview.planCounts.pro}
            </strong>
          </span>
        </div>
      </Card>

      <div className="flex gap-6 text-sm">
        <Link href="/admin/teachers" className="text-accent hover:underline">
          Ver todos os professores →
        </Link>
        <Link href="/admin/users" className="text-accent hover:underline">
          Ver todos os usuários →
        </Link>
        <Link href="/admin/logs" className="text-accent hover:underline">
          Ver logs →
        </Link>
      </div>

      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Atividade recente</h2>
        {recentLogs.length === 0 ? (
          <EmptyState title="Nenhum log registrado ainda." />
        ) : (
          <ul className="flex flex-col gap-2">
            {recentLogs.map((log) => (
              <li key={log.id} className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">
                  {log.event_type}
                </span>{" "}
                — {log.actor_email ?? "sistema"} ·{" "}
                {new Date(log.created_at).toLocaleString("pt-BR")}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
