import {
  getHomeworksOverviewForTeacher,
  type HomeworkOverviewStatus,
} from "@/services/homeworks";
import { getStudentsByTeacher } from "@/services/students";
import { HomeworksFilters } from "@/components/homeworks/HomeworksFilters";
import { HomeworksTable } from "@/components/homeworks/HomeworksTable";
import { Pagination } from "@/components/ui/pagination";
import { buildPaginationHref } from "@/lib/pagination";
import type { Student } from "@/types/student";
import { getCurrentUser } from "@/lib/auth-guard";

const PAGE_SIZE = 10;

const VALID_STATUSES: HomeworkOverviewStatus[] = [
  "in_progress",
  "completed",
  "overdue",
];

export default async function HomeworksPage({
  searchParams,
}: {
  searchParams: {
    search?: string;
    status?: string;
    student?: string;
    page?: string;
  };
}) {
  const user = await getCurrentUser();

  const search = searchParams.search ?? "";
  const status = VALID_STATUSES.includes(
    searchParams.status as HomeworkOverviewStatus
  )
    ? (searchParams.status as HomeworkOverviewStatus)
    : undefined;
  const studentId = searchParams.student ?? "";
  const currentPage =
    Number(searchParams.page) > 0 ? Number(searchParams.page) : 1;

  let rows: HomeworkOverviewRowList = [];
  let totalCount = 0;
  let students: Student[] = [];

  if (user) {
    const [overview, studentsResult] = await Promise.all([
      getHomeworksOverviewForTeacher({
        teacherId: user.id,
        search,
        status,
        studentId: studentId || undefined,
        page: currentPage,
        pageSize: PAGE_SIZE,
      }),
      getStudentsByTeacher({ teacherId: user.id, pageSize: 200 }),
    ]);

    rows = overview.rows;
    totalCount = overview.totalCount;
    students = studentsResult.students;
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  function buildHref(page: number) {
    return buildPaginationHref(
      "/homeworks",
      { search, status, student: studentId },
      page
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Acompanhamento de Homeworks
        </h1>
        <p className="text-sm text-gray-500">
          Todos os homeworks personalizados enviados aos seus alunos.
        </p>
      </div>

      <HomeworksFilters
        defaultSearch={search}
        defaultStatus={status}
        defaultStudentId={studentId}
        students={students}
      />

      <HomeworksTable rows={rows} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        buildHref={buildHref}
      />
    </div>
  );
}

type HomeworkOverviewRowList = Awaited<
  ReturnType<typeof getHomeworksOverviewForTeacher>
>["rows"];
