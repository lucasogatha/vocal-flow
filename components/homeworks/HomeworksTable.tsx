import { ClipboardList } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { HomeworkStatusBadge } from "@/components/homeworks/HomeworkStatusBadge";
import type { HomeworkOverviewRow } from "@/services/homeworks";

export function HomeworksTable({ rows }: { rows: HomeworkOverviewRow[] }) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Ningún homework encontrado."
        description="Crea un homework desde el perfil de un alumno."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
            <th className="px-4 py-3 font-medium">Homework</th>
            <th className="px-4 py-3 font-medium">Alumno</th>
            <th className="px-4 py-3 font-medium">Ejercicios</th>
            <th className="px-4 py-3 font-medium">Progreso</th>
            <th className="px-4 py-3 font-medium">Plazo</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-3 font-medium text-gray-900">
                {row.name}
              </td>
              <td className="px-4 py-3 text-gray-600">{row.studentName}</td>
              <td className="px-4 py-3 text-gray-600">
                {row.totalExercises}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-20">
                    <Progress value={row.percentage} />
                  </div>
                  <span className="text-xs text-gray-500">
                    {row.percentage}%
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600">
                {new Date(row.dueDate + "T00:00:00").toLocaleDateString(
                  "es-419"
                )}
              </td>
              <td className="px-4 py-3">
                <HomeworkStatusBadge status={row.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
