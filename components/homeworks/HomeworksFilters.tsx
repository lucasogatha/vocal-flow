import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Student } from "@/types/student";

type HomeworksFiltersProps = {
  defaultSearch?: string;
  defaultStatus?: string;
  defaultStudentId?: string;
  students: Student[];
};

export function HomeworksFilters({
  defaultSearch,
  defaultStatus,
  defaultStudentId,
  students,
}: HomeworksFiltersProps) {
  return (
    <form method="GET" className="flex flex-wrap gap-2">
      <Input
        type="text"
        name="search"
        defaultValue={defaultSearch}
        placeholder="Buscar homework por nombre"
        className="max-w-xs"
      />

      <select
        name="status"
        defaultValue={defaultStatus ?? ""}
        className="h-10 rounded-md border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <option value="">Todos los estados</option>
        <option value="in_progress">En progreso</option>
        <option value="completed">Completado</option>
        <option value="overdue">Vencido</option>
      </select>

      <select
        name="student"
        defaultValue={defaultStudentId ?? ""}
        className="h-10 rounded-md border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <option value="">Todos los alumnos</option>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.name}
          </option>
        ))}
      </select>

      <Button type="submit" variant="outline">
        Filtrar
      </Button>
    </form>
  );
}
