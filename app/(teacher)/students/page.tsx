import Link from "next/link";
import { Users } from "lucide-react";
import { getStudentsByTeacher } from "@/services/students";
import { countHomeworksByStudentIds } from "@/services/homeworks";
import { StudentCard } from "@/components/students/StudentCard";
import { StudentSearch } from "@/components/students/StudentSearch";
import { Pagination } from "@/components/ui/pagination";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { buildPaginationHref } from "@/lib/pagination";
import { getCurrentUser } from "@/lib/auth-guard";

const PAGE_SIZE = 9;

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) {
  const user = await getCurrentUser();

  const search = searchParams.search ?? "";
  const currentPage =
    Number(searchParams.page) > 0 ? Number(searchParams.page) : 1;

  const { students, totalCount } = user
    ? await getStudentsByTeacher({
        teacherId: user.id,
        search,
        page: currentPage,
        pageSize: PAGE_SIZE,
      })
    : { students: [], totalCount: 0 };

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const homeworksCountByStudent = user
    ? await countHomeworksByStudentIds(
        students.map((student) => student.id),
        user.id
      )
    : {};

  const studentsWithStats = students.map((student) => ({
    student,
    homeworksCount: homeworksCountByStudent[student.id] ?? 0,
  }));

  function buildHref(page: number) {
    return buildPaginationHref("/students", { search }, page);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Mis Alumnos</h1>
          <p className="text-sm text-gray-500">
            Gestiona los alumnos de tu estudio.
          </p>
        </div>

        <Link href="/students/new" className={buttonVariants()}>
          Nuevo alumno
        </Link>
      </div>

      <StudentSearch defaultValue={search} />

      {students.length === 0 ? (
        <EmptyState
          icon={Users}
          title={
            search
              ? "Ningún alumno encontrado para esta búsqueda."
              : "Ningún alumno registrado todavía."
          }
          description={
            search
              ? "Intenta buscar con otro nombre."
              : "Registra tu primer alumno para empezar a enviar homeworks."
          }
          action={
            !search && (
              <Link href="/students/new" className={buttonVariants()}>
                Nuevo alumno
              </Link>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {studentsWithStats.map(({ student, homeworksCount }) => (
            <StudentCard
              key={student.id}
              student={student}
              homeworksCount={homeworksCount}
              lastActivityLabel="Ninguna actividad todavía"
            />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        buildHref={buildHref}
      />
    </div>
  );
}
