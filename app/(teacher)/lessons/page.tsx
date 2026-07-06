import { BookOpen } from "lucide-react";
import { getLessons } from "@/services/lessons";
import { LessonCard } from "@/components/lessons/LessonCard";
import { LessonSearch } from "@/components/lessons/LessonSearch";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { buildPaginationHref } from "@/lib/pagination";

const PAGE_SIZE = 9;

export default async function LessonsPage({
  searchParams,
}: {
  searchParams: { search?: string; sort?: string; page?: string };
}) {
  const search = searchParams.search ?? "";
  const sort = searchParams.sort === "title" ? "title" : "order";
  const currentPage =
    Number(searchParams.page) > 0 ? Number(searchParams.page) : 1;

  const { lessons, totalCount } = await getLessons({
    search,
    sort,
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  function buildHref(page: number) {
    return buildPaginationHref(
      "/lessons",
      { search, sort: sort !== "order" ? sort : undefined },
      page
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Biblioteca de Aulas</h1>
        <p className="text-sm text-gray-500">
          Escolha uma aula para atribuir aos seus alunos.
        </p>
      </div>

      <LessonSearch defaultSearch={search} defaultSort={sort} />

      {lessons.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={
            search
              ? "Nenhuma aula encontrada para essa busca."
              : "Nenhuma aula cadastrada ainda."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
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
