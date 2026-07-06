import { GraduationCap } from "lucide-react";
import { getTeachersOverview } from "@/services/admin";
import { EmptyState } from "@/components/ui/empty-state";

export default async function AdminTeachersPage() {
  const teachers = await getTeachersOverview();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Professores</h1>
        <p className="text-sm text-gray-500">
          Todos os professores cadastrados no VocalFlow.
        </p>
      </div>

      {teachers.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="Nenhum professor cadastrado ainda."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">Plano</th>
                <th className="px-4 py-3 font-medium">Alunos</th>
                <th className="px-4 py-3 font-medium">Homeworks</th>
                <th className="px-4 py-3 font-medium">Cadastro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {teacher.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{teacher.email}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {teacher.planName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {teacher.studentsCount}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {teacher.homeworksCount}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(teacher.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
