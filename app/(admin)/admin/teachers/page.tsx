import { GraduationCap } from "lucide-react";
import { getTeachersOverview } from "@/services/admin";
import { EmptyState } from "@/components/ui/empty-state";

export default async function AdminTeachersPage() {
  const teachers = await getTeachersOverview();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Profesores</h1>
        <p className="text-sm text-muted-foreground">
          Todos los profesores registrados en VocalFlow.
        </p>
      </div>

      {teachers.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="Ningún profesor registrado todavía."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Correo</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Alumnos</th>
                <th className="px-4 py-3 font-medium">Homeworks</th>
                <th className="px-4 py-3 font-medium">Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {teacher.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{teacher.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {teacher.planName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {teacher.studentsCount}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {teacher.homeworksCount}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(teacher.createdAt).toLocaleDateString("es-419")}
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
